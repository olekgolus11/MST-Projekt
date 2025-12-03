# Task 002: Demonstration Playback System

## Status: ✅ COMPLETED

## Description

Create an interactive demonstration system that allows users to step through the OpenVPN protocol flow. The system will include a play button to start the demonstration and a large explanation panel below the main board that shows what's happening at each step.

## Requirements

### Play Button
- [x] Add a "Play" button in the header or near the board
- [x] Button should be clearly visible and styled appropriately
- [x] Button text/icon should change based on state (Play/Pause/Reset)

### State Management
- [x] Create a state machine to manage demonstration steps
- [x] Define all steps of the OpenVPN protocol demonstration
- [x] Track current step and allow navigation (next/previous)
- [ ] Support auto-play with configurable timing (future enhancement)

### Demonstration Steps (Initial Set)
1. [x] **Initial State** - All elements neutral/grey
2. [x] **Step 1: User initiates VPN connection** - Highlight "Użytkownik końcowy" card
3. [x] **Step 2: VPN Client activates** - Change VPN Klient border from grey to blue
4. [x] **Step 3: TLS Handshake begins** - Show connection animation between Client and VPN Client
5. [x] **Step 4: Tunnel established** - Highlight VPN Tunnel, show encrypted state
6. [x] **Step 5: VPN Server receives connection** - Highlight VPN Server
7. [x] **Step 6: Request sent to Internet** - Show data flow to Internet
8. [x] **Step 7: Response returns** - Reverse flow animation

### Explanation Panel (Bottom Box)
- [x] Create a large panel below the main board
- [x] Split into two sections:
  - **Left side**: Textual explanation of what's currently happening
  - **Right side**: Technical details showing packet structure/changes
- [x] Panel should only appear when demonstration is active
- [x] Smooth animation for panel appearance
- [x] Panel content updates based on current step

### Visual Feedback
- [x] Cards change border color based on active state
- [x] Inactive cards: grey/neutral border
- [x] Active cards: blue border (VPN elements) or highlighted
- [x] Smooth transitions between states
- [x] Shadow effects for active elements

## Layout Changes

### Current Layout
```
[Header]
[Board with cards - centered vertically]
```

### New Layout (When Playing)
```
[Header with Play/Pause/Reset Buttons]
[Board with cards - top portion, 45vh]
[Navigation controls - Wstecz/Dalej]
[Explanation Panel - bottom portion]
```

## Technical Implementation

### State Structure
```typescript
interface DemonstrationState {
  isPlaying: boolean;
  currentStep: number;
  steps: Step[];
}

interface Step {
  id: number;
  title: string;
  explanation: string;
  technicalDetails: string;
  activeElements: string[]; // IDs of elements to highlight
}
```

### Files Created/Modified
- [x] `app/page.tsx` - Added play button, explanation panel, state management
- [x] `components/ExplanationPanel.tsx` - New component for bottom panel
- [x] `lib/demonstration-steps.ts` - Defined all 8 demonstration steps

## Acceptance Criteria

1. ✅ Play button is visible and functional
2. ✅ Clicking play starts the demonstration
3. ✅ Explanation panel appears smoothly below the board
4. ✅ VPN Klient card border changes from grey to blue on appropriate step
5. ✅ Explanation panel shows current step information
6. ✅ Technical details panel shows relevant packet/protocol information
7. ✅ All fits within viewport (no scrolling)
8. ✅ Demonstration can be paused and reset

## Design Notes

- Explanation panel has rounded corners with red/coral border (as shown in mockup)
- Vertical divider between left and right sections of the panel
- Smooth transitions (300ms) for all state changes
- Cards get shadow effects when active
- Navigation shows current step number and total steps

## Future Enhancements (Out of Scope for Now)

- [ ] Auto-play mode with configurable timing
- [ ] Speed control for auto-play
- [ ] Detailed packet visualization with animations
- [ ] Animation of data packets moving between elements
- [ ] Keyboard navigation support
