import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma, UserRole, UserPlan } from 'database';
import crypto from 'crypto';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const refreshSchema = z.object({
  refreshToken: z.string(),
});

const logoutSchema = z.object({
  allDevices: z.boolean().default(false),
}).optional();

export const authRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  
  // POST /auth/register
  fastify.post('/register', async (request, reply) => {
    const parse = registerSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid registration parameters',
          details: parse.error.format()
        }
      });
    }

    const { email, password, fullName } = parse.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return reply.status(409).send({
        success: false,
        error: {
          code: 'CONFLICT',
          message: 'A user with this email address already exists'
        }
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        role: UserRole.USER,
        plan: UserPlan.FREE,
      }
    });

    // Generate tokens
    const accessToken = fastify.jwt.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
      plan: user.plan
    });

    const tokenFamily = crypto.randomUUID();
    const refreshToken = fastify.jwt.sign({
      sub: user.id,
      tokenFamily
    }, { expiresIn: '7d' });

    const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

    await prisma.session.create({
      data: {
        userId: user.id,
        refreshTokenHash: hashedRefreshToken,
        tokenFamily,
        userAgent: request.headers['user-agent'] || null,
        ipAddress: request.ip,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    return reply.status(201).send({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          plan: user.plan
        },
        accessToken,
        refreshToken
      }
    });
  });

  // POST /auth/login
  fastify.post('/login', async (request, reply) => {
    const parse = loginSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid login parameters',
          details: parse.error.format()
        }
      });
    }

    const { email, password } = parse.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash || !user.isActive) {
      return reply.status(401).send({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid email or password'
        }
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return reply.status(401).send({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid email or password'
        }
      });
    }

    // Update login timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // Generate tokens
    const accessToken = fastify.jwt.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
      plan: user.plan
    });

    const tokenFamily = crypto.randomUUID();
    const refreshToken = fastify.jwt.sign({
      sub: user.id,
      tokenFamily
    }, { expiresIn: '7d' });

    const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

    await prisma.session.create({
      data: {
        userId: user.id,
        refreshTokenHash: hashedRefreshToken,
        tokenFamily,
        userAgent: request.headers['user-agent'] || null,
        ipAddress: request.ip,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    return reply.status(200).send({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          plan: user.plan
        },
        accessToken,
        refreshToken
      }
    });
  });

  // POST /auth/refresh
  fastify.post('/refresh', async (request, reply) => {
    const parse = refreshSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid refresh parameters',
          details: parse.error.format()
        }
      });
    }

    const { refreshToken } = parse.data;

    let payload: any;
    try {
      payload = fastify.jwt.verify(refreshToken);
    } catch {
      return reply.status(401).send({
        success: false,
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'Refresh token has expired or is invalid'
        }
      });
    }

    const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

    // Retrieve active session
    const activeSession = await prisma.session.findUnique({
      where: { refreshTokenHash: hashedRefreshToken },
      include: { user: true }
    });

    // Refresh Token Reuse Attack Detection (Section 10.1)
    if (!activeSession || activeSession.revokedAt || activeSession.expiresAt < new Date()) {
      // If family is present in database, revoke the WHOLE family (mitigates refresh reuse attack)
      if (payload.tokenFamily) {
        await prisma.session.updateMany({
          where: { tokenFamily: payload.tokenFamily },
          data: { revokedAt: new Date() }
        });
      }
      return reply.status(401).send({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Refresh token reuse detected or invalid session'
        }
      });
    }

    // Revoke old token
    await prisma.session.update({
      where: { id: activeSession.id },
      data: { revokedAt: new Date() }
    });

    const user = activeSession.user;

    // Issue rotating credentials
    const newAccessToken = fastify.jwt.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
      plan: user.plan
    });

    const newRefreshToken = fastify.jwt.sign({
      sub: user.id,
      tokenFamily: activeSession.tokenFamily
    }, { expiresIn: '7d' });

    const newHashedRefreshToken = crypto.createHash('sha256').update(newRefreshToken).digest('hex');

    await prisma.session.create({
      data: {
        userId: user.id,
        refreshTokenHash: newHashedRefreshToken,
        tokenFamily: activeSession.tokenFamily,
        userAgent: request.headers['user-agent'] || null,
        ipAddress: request.ip,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    return reply.status(200).send({
      success: true,
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    });
  });

  // POST /auth/logout (Authenticated)
  fastify.post('/logout', { preHandler: [fastify.authenticate as any] }, async (request: any, reply) => {
    const parse = logoutSchema.safeParse(request.body || {});
    const allDevices = parse.success && parse.data ? parse.data.allDevices : false;

    const userId = request.user.sub;

    if (allDevices) {
      // Revoke all sessions for this user
      await prisma.session.updateMany({
        where: { userId },
        data: { revokedAt: new Date() }
      });
    } else {
      // Just revoke the current session (optional: can extract from token header if required, or match user sessions)
      await prisma.session.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() }
      });
    }

    return reply.status(200).send({
      success: true,
      data: {
        message: 'Logged out successfully'
      }
    });
  });
};
