This is an excellent addition. For an enterprise-grade online exam, the **Proctoring Monitor should be a persistent panel** on the exam screen rather than a pop-up. Below is a detailed requirement you can provide to your UI/UX, React, Backend, and AI teams.

---

# Module: Live Proctoring Monitor

## Objective

The Proctoring Monitor shall be displayed **throughout the examination** on the **right-side panel** of the exam screen. It provides the candidate with a live webcam preview while continuously performing AI-assisted monitoring to ensure exam integrity.

The monitor starts **before the exam begins** and remains active until the exam is completed or terminated.

---

# UI Layout

```
 ---------------------------------------------------------------
| Question Panel (75%)             | Live Proctoring Panel (25%) |
|                                  |-----------------------------|
| Question                         | Live Camera Preview         |
| Options                          |                             |
| Images                           |   [Live Webcam]             |
| Videos                           |                             |
|----------------------------------|-----------------------------|
| Previous | Next | Review | Save  | Recording Status           |
|                                  | ● Recording                |
|                                  | 🎤 Microphone Active       |
|                                  | 🖥 Screen Sharing Active   |
|                                  | 😊 Face Detected          |
|                                  | 👤 Single Person          |
|                                  | 👀 Looking Forward        |
|                                  | 💡 Lighting Good          |
|                                  | 🌐 Internet Connected     |
|                                  | ⏱ Remaining Time          |
 ---------------------------------------------------------------
```

The right panel should remain visible at all times and cannot be collapsed or hidden by the employee.

---

# Functional Requirements

## FR-01 Live Camera Preview

The right panel shall display:

* Live webcam preview
* Recording indicator
* Camera status
* Microphone status
* Screen-sharing status
* AI monitoring status

Requirements:

* Preview updates in real time.
* Video continues while recording.
* Candidate can verify they are visible.
* Preview must not interrupt exam navigation.

---

## FR-02 Recording Indicator

Display:

```
🔴 Recording

Recording Duration

Video Status

Audio Status
```

Example:

```
🔴 Recording

00:24:15
```

If recording stops unexpectedly:

```
⚠ Recording Interrupted
```

Log a High Severity violation.

---

# FR-03 Face Detection

The AI shall continuously verify:

✓ Face detected

✓ Exactly one face

✓ Face centered

✓ Face clearly visible

✓ Eyes visible

✓ Adequate lighting

Monitoring frequency:

* Every 1–2 seconds (configurable)

---

# FR-04 Head Movement Detection

The AI shall continuously estimate head pose and monitor orientation.

Expected posture:

```
Forward

Slight Left

Slight Right

Slight Up

Slight Down
```

The following conditions should be detected:

### Excessive Left Turn

```
Candidate continuously looks left.
```

Violation:

```
Looking Left Too Long
```

---

### Excessive Right Turn

```
Candidate continuously looks right.
```

Violation:

```
Looking Right Too Long
```

---

### Looking Down

Possible:

* Mobile phone
* Notes
* Keyboard

If duration exceeds configured threshold:

Generate violation.

---

### Looking Up

Possible:

* External monitor
* Wall notes

Generate warning.

---

### Continuous Head Movement

Detect repeated scanning of the room.

Example:

```
Left

Right

Left

Up

Right
```

Possible cheating behaviour.

---

### Head Outside Camera Frame

If head leaves frame for more than a configured duration:

```
Face Missing
```

High Severity.

---

# FR-05 Eye Gaze Detection

Monitor:

* Looking at screen
* Looking away
* Eyes closed
* Eyes not visible

Example violations:

```
Looking Away

Eyes Closed

Eyes Covered
```

---

# FR-06 Face Visibility

Detect:

```
Face covered

Hand covering face

Mask (configurable)

Book covering face

Phone covering face
```

Generate violation.

---

# FR-07 Multiple Person Detection

Continuously monitor:

```
Number of faces
```

Cases:

```
0 Face

1 Face

2 Faces

3 Faces
```

If more than one face:

```
High Severity

Immediate Alert
```

---

# FR-08 Face Matching

Before exam:

Compare

```
Employee Profile Photo

↓

Live Camera
```

If similarity below threshold:

```
Identity Verification Failed
```

Exam cannot start.

---

# FR-09 Expression Detection (Optional)

Detect:

```
Sleeping

Yawning

Talking

Distracted

Not Looking at Screen
```

Used only for review; not automatic disqualification.

---

# FR-10 Lighting Detection

Monitor:

```
Too Dark

Too Bright

Backlight

Camera Covered
```

Warning:

```
Improve room lighting.
```

---

# FR-11 Camera Quality Monitoring

Continuously verify:

```
Camera Resolution

Frame Rate

Blur Detection

Frozen Video

Black Screen
```

---

# FR-12 Candidate Distance

Estimate:

```
Too Close

Normal

Too Far
```

Prompt user if outside acceptable range.

---

# FR-13 Body Position

Detect:

```
Upper Body Visible

Shoulders Visible

Face Centered

Head Tilt

Standing Up

Leaving Seat
```

---

# FR-14 Mobile Phone Detection

AI shall identify:

```
Phone

Tablet

Electronic Device
```

Generate High Severity violation.

---

# FR-15 Book / Paper Detection

Detect:

```
Notebook

Book

Printed Paper

Sticky Notes
```

Log event for administrator review.

---

# FR-16 Hand Movement Detection

Monitor:

```
Hand covering face

Hand leaving frame

Writing outside screen

Frequent hand movement
```

---

# FR-17 Talking Detection

Using audio + video:

Detect:

```
Speaking

Mouth movement

Conversation

Multiple voices
```

---

# FR-18 Candidate Presence

Continuously verify:

```
Candidate Present
```

If absent:

```
Timer Continues

Violation Logged

Warning Displayed
```

---

# FR-19 Behaviour Score

Generate live behaviour score.

Example:

| Parameter         | Score |
| ----------------- | ----- |
| Face Visible      | 100   |
| Looking Forward   | 100   |
| No Multiple Faces | 100   |
| Head Stability    | 95    |
| Audio Compliance  | 100   |

Overall

```
Compliance Score

98%
```

---

# FR-20 Live Status Indicators

Display on the right panel:

```
🟢 Camera

🟢 Microphone

🟢 Screen Sharing

🟢 Recording

🟢 Face

🟢 Identity Verified

🟢 Internet

🟢 Fullscreen
```

If any service fails:

```
🔴 Camera Disconnected

🔴 Screen Share Lost

🔴 Microphone Disabled
```

---

# FR-21 Violation Timeline

Display recent events.

Example:

```
10:05 Looking Left

10:07 Face Missing

10:08 Screen Share Stopped

10:10 Warning Issued
```

---

# FR-22 Administrator Dashboard

Live administrator view should show:

* Candidate webcam
* Screen-sharing preview
* Current question number
* Remaining time
* Compliance score
* Face status
* Head direction
* Eye gaze
* Audio status
* Active warnings
* Violation timeline
* Recording status

---

# AI Detection Technologies (Recommended)

| Feature                        | Suggested Technology                                           |
| ------------------------------ | -------------------------------------------------------------- |
| Face Detection                 | MediaPipe Face Detection or TensorFlow.js Face Detection       |
| Face Mesh (468 landmarks)      | MediaPipe Face Mesh                                            |
| Head Pose Estimation           | MediaPipe Face Mesh + head pose calculation (yaw, pitch, roll) |
| Eye Gaze Estimation            | MediaPipe Iris / Face Mesh                                     |
| Object Detection (Phone, Book) | TensorFlow.js COCO-SSD or YOLO (server-side)                   |
| Person Detection               | TensorFlow.js COCO-SSD / MediaPipe                             |
| Hand Detection                 | MediaPipe Hands                                                |
| Pose Detection                 | MediaPipe Pose                                                 |

> **Recommendation:** For a React application, **MediaPipe Tasks Vision** is generally the best choice for real-time browser-based proctoring. It provides better accuracy and performance than older libraries such as `face-api.js`, especially for head pose, face landmarks, hand tracking, and body pose estimation.

---

# Acceptance Criteria

The feature will be considered complete when:

* The proctoring panel is permanently visible on the right side during the exam.
* Live webcam preview is displayed with active recording status.
* Camera and microphone recording begin before the first question and continue until the exam ends.
* AI continuously monitors face presence, head movement, eye gaze, body position, lighting, and candidate presence.
* The system detects conditions such as multiple faces, looking away, leaving the seat, phone usage, books/papers, and camera obstruction.
* All violations are timestamped, stored, and visible to administrators in real time.
* Candidates cannot hide, minimize, or disable the proctoring panel while the exam is in progress.
