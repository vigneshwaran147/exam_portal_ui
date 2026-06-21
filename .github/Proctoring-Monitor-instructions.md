Yes. For a secure online examination, you can make **camera and microphone recording mandatory** from the moment the exam starts until it ends. Below is a detailed requirement that you can add to your SRS.

---

# Requirement: Mandatory Camera & Microphone Recording

## Module

**Audio and Video Recording**

## Objective

The system shall **automatically start video and audio recording** immediately after all mandatory proctoring validations are completed and **before the first exam question is displayed**.

Recording shall continue uninterrupted until:

* Employee submits the exam.
* Exam timer expires (auto submit).
* Administrator terminates the exam.
* System terminates the exam due to policy violations.

The employee shall **not have the option to stop or pause recording**.

---

# Functional Flow

```text
Click Start Exam
        │
        ▼
Validate Camera
        │
Validate Microphone
        │
Validate Screen Sharing
        │
Enter Fullscreen
        │
Start Video Recording
        │
Start Audio Recording
        │
Recording Status = ACTIVE
        │
Start Exam
        │
Continuous Recording
        │
Exam Submitted
        │
Stop Recording
        │
Upload Remaining Files
        │
Generate Recording Metadata
```

---

# Functional Requirements

## FR-01 Automatic Recording

The application shall automatically:

* Request camera permission.
* Request microphone permission.
* Verify both devices are available.
* Start recording before the exam begins.

The employee shall not be allowed to disable recording.

---

## FR-02 Video Recording

The system shall record:

* Webcam video
* Timestamp
* Session ID
* Employee ID
* Exam ID

Recommended quality:

* Resolution: **720p** (configurable)
* FPS: **15–30**
* Codec: **VP8/VP9 or H.264** (browser dependent)
* Container: **WebM** (preferred) or MP4 if supported

---

## FR-03 Audio Recording

The system shall record:

* Candidate microphone audio
* Timestamp
* Session ID
* Audio level metadata (optional)

Recommended:

* Mono
* 16 kHz or 44.1 kHz
* Noise suppression enabled (if supported)
* Echo cancellation enabled

---

## FR-04 Continuous Recording

Recording shall continue during:

* Answering questions
* Navigating questions
* Reviewing answers
* Temporary network interruptions (buffer locally if possible)

Recording shall stop **only** after the exam session ends.

---

## FR-05 Recording Segmentation (Recommended)

Instead of generating one large file, recordings should be split into smaller chunks.

Example:

| Duration  | File           |
| --------- | -------------- |
| 0–30 sec  | video_001.webm |
| 30–60 sec | video_002.webm |
| 60–90 sec | video_003.webm |

Benefits:

* Lower memory usage
* Easier uploads
* Better recovery after network interruptions
* Reduced risk of losing the entire recording

---

## FR-06 Automatic Upload

Each recording segment shall be uploaded automatically.

Upload interval:

* Every **30–60 seconds** (configurable)

Each upload shall include:

```json
{
  "sessionId": "...",
  "employeeId": "...",
  "examId": "...",
  "sequence": 12,
  "startTime": "...",
  "endTime": "...",
  "duration": 30
}
```

---

## FR-07 Offline Handling

If network connectivity is lost:

* Continue recording locally.
* Queue recording chunks.
* Retry upload automatically after reconnection.
* Preserve upload order.

---

## FR-08 Recording Status Monitoring

The frontend shall continuously verify:

* Camera stream active
* Microphone stream active
* Recording active
* Recorder not paused
* Recorder not stopped

If recording stops unexpectedly:

1. Log a violation.
2. Attempt automatic restart.
3. Notify the employee.
4. Notify the administrator.
5. Apply configured exam policy if restart fails.

---

## FR-09 Recording Failure

If recording cannot start:

The exam **must not start**.

Example message:

> Camera and microphone recording are mandatory. Please enable both devices before starting the exam.

---

## FR-10 Device Disconnect Detection

Detect:

### Camera

* Camera unplugged
* Camera disabled
* Video stream ended

### Microphone

* Microphone unplugged
* Permission revoked
* Audio stream ended

Actions:

* Log violation
* Display warning
* Attempt recovery
* Notify admin
* Apply configured policy

---

## FR-11 Recording Metadata

Store for each recording:

| Field         | Description               |
| ------------- | ------------------------- |
| Session ID    | Unique monitoring session |
| Employee ID   | Candidate                 |
| Exam ID       | Exam                      |
| Chunk Number  | Recording sequence        |
| Start Time    | Recording start           |
| End Time      | Recording end             |
| Duration      | Seconds                   |
| File Name     | Uploaded file             |
| File Size     | Bytes                     |
| Upload Status | Pending/Uploaded/Failed   |
| Retry Count   | Upload retries            |
| SHA-256 Hash  | Integrity verification    |

---

## FR-12 End Recording

When the exam finishes:

The system shall:

* Stop recording.
* Flush remaining buffered data.
* Upload the final chunk.
* Verify all uploads completed.
* Close the monitoring session.
* Generate recording summary.

---

# Administrator Requirements

The administrator shall be able to:

* View recording status (Live/Stopped/Error)
* View upload progress
* Download recordings (based on permissions)
* Play synchronized audio/video recordings
* Search recordings by employee, exam, or session
* View timestamps for violations

---

# Database Tables

### ProctorSession

```
SessionId
EmployeeId
ExamId
StartTime
EndTime
Status
```

---

### RecordingChunks

```
ChunkId
SessionId
SequenceNumber
MediaType (Video/Audio)
StartTime
EndTime
Duration
FileName
FilePath
FileSize
Checksum
UploadStatus
CreatedDate
```

---

### RecordingEvents

```
EventId
SessionId
EventType
Timestamp
Description
```

Examples:

* Recording Started
* Recording Stopped
* Camera Lost
* Microphone Lost
* Upload Failed
* Upload Success

---

# Frontend Components

```
<ProctorInitializer />

<CameraRecorder />

<MicrophoneRecorder />

<RecordingStatus />

<UploadManager />

<ViolationManager />

<HeartbeatService />
```

---

# Acceptance Criteria

* Camera and microphone recording start automatically before the exam begins.
* The employee cannot start the exam if recording cannot be initiated.
* Recording continues for the entire duration of the exam.
* Recordings are split into configurable chunks and uploaded automatically.
* Network interruptions do not stop recording; uploads resume after reconnection.
* Device disconnections are detected, logged, and handled according to policy.
* All recording metadata and files are securely stored and available for audit and administrator review.

## Technical Recommendation

For a React-based application, a reliable architecture is:

* **Frontend:** React + `MediaRecorder` API for camera and microphone capture.
* **Streaming/Uploads:** Upload 30–60 second chunks via REST or WebSocket instead of waiting until the exam ends.
* **Backend:** Store recordings in object storage (e.g., S3-compatible storage, Azure Blob Storage, or on-premises storage) and keep metadata in the database.
* **Security:** Encrypt recordings at rest, use HTTPS/TLS for uploads, and enforce strict access control so only authorized administrators can access recordings. This approach is more scalable and resilient than storing a single large recording file.
