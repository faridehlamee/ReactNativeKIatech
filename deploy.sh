#!/bin/bash
# Simple deployment script for Railway
cd backend
npm install --include=dev
npm run build
npm start