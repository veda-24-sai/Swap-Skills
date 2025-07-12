# Skill Swap Platform Backend

A fully developed MERN stack backend for a Skill Swap platform, enabling users to exchange skills, manage profiles, request swaps, rate each other, and for admins to moderate the platform. Built with Node.js, Express, MongoDB, and Passport.js for authentication.

---

##  Project Overview

This backend powers a skill swap platform where users can:
- Register and log in securely
- Complete and update their profiles
- Offer and request skills
- Browse/search other users
- Send and manage swap requests
- Rate and review each other after swaps
- Admins can moderate users, skills, and platform activity

Authentication is session-based (cookies), and all endpoints are protected as appropriate.

---

##  Tech Stack
- *Node.js* + *Express.js* (API server)
- *MongoDB* + *Mongoose* (database)
- *Passport.js* (authentication)
- *Multer* (file uploads)
- *Helmet, CORS, Rate Limiting* (security)

---

##  API Endpoints & Functionality

###  Authentication APIs
| Method | Endpoint                | Description |
|--------|-------------------------|-------------|
| POST   | /api/auth/register      | Register a new user (minimal info, optional avatar) |
| POST   | /api/auth/login         | Authenticate user and start session |
| POST   | /api/auth/logout        | Invalidate user session |
| GET    | /api/auth/me            | Get current logged-in user's profile |
| PUT    | /api/auth/profile       | Complete or update user profile (with avatar upload) |

###  User Profile APIs
| Method | Endpoint                | Description |
|--------|-------------------------|-------------|
| GET    | /api/users              | Browse/search users (by skill, location, etc.) |
| GET    | /api/users/:id          | Get user profile by ID |
| PUT    | /api/users/:id          | Update user profile (name, location, etc.) |
| DELETE | /api/users/:id          | Delete user account |

###  Skills Management APIs
| Method | Endpoint                        | Description |
|--------|----------------------------------|-------------|
| GET    | /api/skills                      | Get all available skills |
| POST   | /api/skills/offer                | Add a skill to user's "offered" list |
| POST   | /api/skills/request              | Add a skill to user's "wanted" list |
| DELETE | /api/skills/offer/:skill         | Remove a skill from user's "offered" list |
| DELETE | /api/skills/request/:skill       | Remove a skill from user's "wanted" list |
| GET    | /api/skills/search?name=Skill    | Search users by skill name |

###  Swap Request APIs
| Method | Endpoint                        | Description |
|--------|----------------------------------|-------------|
| POST   | /api/swaps                       | Send a swap request to another user |
| GET    | /api/swaps                       | Get all swaps involving the logged-in user |
| GET    | /api/swaps/:id                   | Get details of a specific swap |
| PUT    | /api/swaps/:id/accept            | Accept a pending swap request |
| PUT    | /api/swaps/:id/reject            | Reject a pending swap request |
| DELETE | /api/swaps/:id                   | Cancel a pending swap request |

###  Ratings & Feedback APIs
| Method | Endpoint                        | Description |
|--------|----------------------------------|-------------|
| POST   | /api/feedback/:swapId            | Submit feedback/rating after a completed swap |
| GET    | /api/feedback/user/:userId       | Get all feedback received by a user |
| GET    | /api/feedback/swap/:swapId       | Get feedback for a specific swap |

###  Admin APIs
| Method | Endpoint                        | Description |
|--------|----------------------------------|-------------|
| GET    | /api/admin/users                 | View all users (with filtering/moderation info) |
| PUT    | /api/admin/users/:id/ban         | Ban a user from the platform |
| PUT    | /api/admin/users/:id/unban       | Unban a user |
| GET    | /api/admin/swaps                 | Monitor all swaps (filter by status) |
| DELETE | /api/admin/skills/:id            | Delete inappropriate/spammy skill entries |
| POST   | /api/admin/messages              | Send a platform-wide message/announcement |
| GET    | /api/admin/reports               | Download user activity logs, swap stats, feedback reports |

###  Data APIs
| Method | Endpoint                | Description |
|--------|-------------------------|-------------|
| GET    | /api/projects           | Get all projects |
| GET    | /api/requests           | Get all requests |

###  Server APIs
| Method | Endpoint                | Description |
|--------|-------------------------|-------------|
| GET    | /                       | API info |
| GET    | /health                 | Health check |

---

##  Security & Middleware
- *Session-based authentication* (cookies, Passport.js)
- *CORS* enabled for frontend
- *Helmet* for HTTP headers
- *Rate limiting* to prevent abuse
- *Multer* for avatar uploads

---


##  Notes
- All endpoints return JSON responses.
- Most endpoints require authentication (except registration/login/info routes).
- Admin endpoints require the user to have isAdmin: true.
- File uploads (avatars) are handled via multipart/form-data.
- All error cases return a JSON { error: "..." } message.

---

##  Team & Contributions

This project was developed by a team of four members for the Odoo Hackathon:

### Team Members & Contributions

#### *Jahnavi* - Backend Architecture & Authentication
- Designed and implemented the core backend architecture
- Built authentication system with Passport.js and session management
- Created user registration, login, and profile management APIs
- Implemented security middleware (CORS, Helmet, Rate Limiting)
- Set up MongoDB connection and database schema design

#### *Sahitha* - Skills Management & User Profiles
- Developed skills management system (offer/request skills)
- Built user profile CRUD operations
- Implemented user search and filtering functionality
- Created skills search  feature
- Added avatar upload functionality with Multer

#### *Sindhusha* - Swap System & Feedback
- Designed and implemented the complete swap request system
- Built swap lifecycle management (create, accept, reject, cancel)
- Created feedback and rating system for completed swaps
- Implemented user rating calculations and updates
- Developed swap status tracking and notifications

#### *Veda* - Admin Panel & Platform Management
- Built comprehensive admin panel with user moderation
- Implemented user banning/unbanning functionality
- Created admin reports and analytics system
- Developed platform-wide messaging system
- Built admin tools for skill moderation and platform oversight

### Collaboration Highlights
- All team members contributed to API documentation and testing
- Collaborative code reviews and quality assurance
- Shared responsibility for database design and optimization
- Team effort in implementing security best practices

---

##  Author & License
- Developed for Odoo Hackathon by Team SkillSwap
- MIT License
