/**
 * @typedef {Object} Article
 * @property {string} id
 * @property {string} title
 * @property {string} slug
 * @property {string} content
 * @property {string} excerpt
 * @property {string} coverImage
 * @property {string} authorId
 * @property {string} authorName
 * @property {string} authorEmail
 * @property {string[]} categories
 * @property {string[]} tags
 * @property {'draft'|'published'|'archived'} status
 * @property {boolean} featured
 * @property {boolean} trending
 * @property {number} viewCount
 * @property {number} likeCount
 * @property {number} bookmarkCount
 * @property {number} commentCount
 * @property {number} readingTime
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string} [publishedAt]
 * @property {string} [metaTitle]
 * @property {string} [metaDescription]
 * @property {string} [canonicalUrl]
 */

/**
 * @typedef {Object} User
 * @property {string} uid
 * @property {string} displayName
 * @property {string} email
 * @property {string} [photoURL]
 * @property {'reader'|'admin'|'editor'} role
 * @property {string[]} bookmarks
 * @property {string} createdAt
 */

/**
 * @typedef {Object} Comment
 * @property {string} id
 * @property {string} articleId
 * @property {string} authorName
 * @property {string} authorEmail
 * @property {string} content
 * @property {string} [parentId]
 * @property {'pending'|'approved'|'rejected'} status
 * @property {string} createdAt
 */

/**
 * @typedef {Object} Subscriber
 * @property {string} id
 * @property {string} email
 * @property {string} [name]
 * @property {string} subscribedAt
 * @property {'active'|'unsubscribed'} status
 */
