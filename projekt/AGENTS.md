# OpenVPN Protocol Demonstration Project

## Overview

This project is an interactive visualization that demonstrates how the OpenVPN protocol works. It provides a visual representation of the data flow between a client device, VPN client process, VPN server process, and the internet, showing how encryption and tunneling protect user data.

## Project Goals

- Create an educational, interactive visualization of OpenVPN protocol
- Show the flow of data through the VPN tunnel
- Demonstrate key concepts: encryption, tunneling, and privacy protection
- Make complex networking concepts accessible through visual representation

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4

## Development Guidelines

### TODO Lists

**IMPORTANT:** All TODO lists and task tracking MUST be created in the `/todo` directory. Each task or feature should have its own markdown file with clear acceptance criteria and status tracking.

Example structure:
```
/todo
  ├── 001-initial-board-layout.md
  ├── 002-animation-system.md
  └── ...
```

### Code Style

- Use Biome for linting and formatting
- Follow React best practices with functional components and hooks
- Use TypeScript strictly - avoid `any` types
- Prefer Tailwind CSS for styling

## Architecture

The visualization consists of 4 main actors:
1. **Client** - The user's device
2. **Client's VPN Process** - Local VPN client handling encryption
3. **Server's VPN Process** - Remote VPN server handling decryption
4. **Internet** - The destination (websites, services)

A visual "tunnel" connects the VPN processes to demonstrate the secure encrypted channel.