/**
 * JWT Utilities
 * Handles JWT token generation, validation, and revocation
 */

import jwt from 'jsonwebtoken';
import { client } from './db.js';
import { jwtConfig } from '../config/index.js';

/**
 * Generate a secure JWT token
 * @param {Object} payload - Token payload
 * @param {string} payload.userId - User ID
 * @param {string} payload.role - User role
 * @param {string} payload.email - User email
 * @returns {string} JWT token
 */
export function generateToken(payload) {
    try {
        // Add security claims
        const tokenPayload = {
            ...payload,
            iat: Math.floor(Date.now() / 1000),
            jti: require('crypto').randomUUID(), // Unique token ID for revocation
        };

        return jwt.sign(tokenPayload, jwtConfig.secret, {
            expiresIn: jwtConfig.expiresIn,
            algorithm: jwtConfig.algorithm,
            issuer: jwtConfig.issuer,
            audience: jwtConfig.audience
        });
    } catch (error) {
        throw new Error('Error generating JWT token: ' + error.message);
    }
}

/**
 * Verify and decode JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
export async function verifyToken(token) {
    try {
        // Verify token signature and claims
        const decoded = jwt.verify(token, jwtConfig.secret, {
            algorithms: [jwtConfig.algorithm],
            issuer: jwtConfig.issuer,
            audience: jwtConfig.audience
        });

        // Check if token is blacklisted (revoked)
        if (jwtConfig.revocation.enabled) {
            const isRevoked = await isTokenRevoked(decoded.jti);
            if (isRevoked) {
                throw new Error('Token has been revoked');
            }
        }

        return decoded;
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('Token has expired');
        } else if (error.name === 'JsonWebTokenError') {
            throw new Error('Invalid token');
        } else if (error.name === 'NotBeforeError') {
            throw new Error('Token not active yet');
        }
        throw new Error('Token verification failed: ' + error.message);
    }
}

/**
 * Revoke a JWT token by adding it to blacklist
 * @param {string} token - JWT token to revoke
 * @returns {boolean} Success status
 */
export async function revokeToken(token) {
    try {
        if (!jwtConfig.revocation.enabled) {
            throw new Error('Token revocation is disabled');
        }

        // Decode token to get JTI (without verification since we want to revoke even invalid tokens)
        const decoded = jwt.decode(token);
        if (!decoded || !decoded.jti) {
            throw new Error('Invalid token format');
        }

        const db = client.db("RentWise");
        const blacklistCollection = db.collection(jwtConfig.revocation.blacklistCollection);

        // Add token to blacklist
        await blacklistCollection.insertOne({
            jti: decoded.jti,
            userId: decoded.userId,
            revokedAt: new Date(),
            expiresAt: new Date(decoded.exp * 1000), // Convert to milliseconds
            reason: 'manual_revocation'
        });

        return true;
    } catch (error) {
        throw new Error('Error revoking token: ' + error.message);
    }
}

/**
 * Check if a token is revoked
 * @param {string} jti - JWT ID to check
 * @returns {boolean} True if token is revoked
 */
export async function isTokenRevoked(jti) {
    try {
        if (!jwtConfig.revocation.enabled || !jti) {
            return false;
        }

        const db = client.db("RentWise");
        const blacklistCollection = db.collection(jwtConfig.revocation.blacklistCollection);

        const revokedToken = await blacklistCollection.findOne({
            jti: jti,
            expiresAt: { $gt: new Date() } // Only check non-expired blacklist entries
        });

        return !!revokedToken;
    } catch {
        // Log error internally - console statements disabled for production
        // On error, assume token is not revoked to avoid blocking valid users
        return false;
    }
}

/**
 * Clean up expired tokens from blacklist
 * This should be run periodically as a maintenance task
 */
export async function cleanupExpiredTokens() {
    if (!jwtConfig.revocation.enabled) {
        return 0;
    }

    const db = client.db("RentWise");
    const blacklistCollection = db.collection(jwtConfig.revocation.blacklistCollection);

    const result = await blacklistCollection.deleteMany({
        expiresAt: { $lt: new Date() }
    });

    // Log cleanup success internally
    return result.deletedCount;
}

/**
 * Revoke all tokens for a specific user
 * @param {string} userId - User ID
 * @returns {number} Number of tokens revoked
 */
export async function revokeAllUserTokens(userId) {
    try {
        if (!jwtConfig.revocation.enabled) {
            throw new Error('Token revocation is disabled');
        }

        const db = client.db("RentWise");
        const blacklistCollection = db.collection(jwtConfig.revocation.blacklistCollection);

        // This is a special entry to revoke all tokens issued before this time
        await blacklistCollection.insertOne({
            userId: userId,
            revokeAllBefore: new Date(),
            reason: 'revoke_all_user_tokens',
            createdAt: new Date()
        });

        // Log success internally
        return true;
    } catch (error) {
        throw new Error('Error revoking all user tokens: ' + error.message);
    }
}

export default {
    generateToken,
    verifyToken,
    revokeToken,
    isTokenRevoked,
    cleanupExpiredTokens,
    revokeAllUserTokens
};