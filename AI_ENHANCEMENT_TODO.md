# AI Chatbox Enhancement TODO

## 1. Fix Current Issues
- [x] Move GEMINI_API_KEY from hardcoded to .env file
- [x] Add error logging in aiController.js for better debugging

## 2. Personalized Responses
- [x] Update User model to include major, year, courses, language fields
- [x] Modify aiController.js to fetch user profile and include in Gemini prompt

## 3. App Feature Integration
- [x] Add functions in aiController.js to query connections, posts, stories
- [ ] Create new routes in aiRoutes.js for app data queries (e.g., /api/ai/suggest-connections)

## 4. Advanced Queries
- [x] Implement command parsing in aiController.js (e.g., "show schedule", "find study groups")
- [x] Add logic to handle specific commands and query relevant data

## 5. Multi-language Support
- [x] Install google-translate-api or similar library
- [x] Add language detection and translation in aiController.js

## 6. Voice Input/Output
- [x] Update Chatbot.jsx to add Web Speech API for speech-to-text input
- [ ] Add text-to-speech output for AI responses

## 7. Better Error Handling
- [x] Improve error messages and add fallback responses in aiController.js
- [x] Handle API failures gracefully

## 8. Frontend Updates
- [x] Add language selector in Chatbot.jsx
- [x] Add voice input/output buttons
- [x] Enhance UI for new features

## 9. Testing and Verification
- [ ] Test server and chatbox functionality
- [ ] Verify personalization, commands, voice, multi-language work
- [ ] Run ESLint and fix any issues
