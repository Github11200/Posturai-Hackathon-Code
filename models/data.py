import pandas as pd
import json
import cv2
import mediapipe as mp
import os

mp_pose = mp.solutions.pose
pose = mp_pose.Pose(static_image_mode=True, min_detection_confidence=0.5)

landmark_names = [
    "nose",
    "left_eye_inner",
    "left_eye",
    "left_eye_outer",
    "right_eye_inner",
    "right_eye",
    "right_eye_outer",
    "left_ear",  # <-- Index 7
    "right_ear",  # <-- Index 8
    "mouth_left",
    "mouth_right",
    "left_shoulder",  # <-- Index 11
    "right_shoulder",  # <-- Index 12
    "left_elbow",
    "right_elbow",
    "left_wrist",
    "right_wrist",
    "left_pinky",
    "right_pinky",
    "left_index",
    "right_index",
    "left_thumb",
    "right_thumb",
    "left_hip",
    "right_hip",
    "left_knee",
    "right_knee",
    "left_ankle",
    "right_ankle",
    "left_heel",
    "right_heel",
    "left_foot_index",
    "right_foot_index",
]


def load_images(path: str, filename: str):
    number_of_images: int = len(os.listdir(path))
    images = []
    for i in range(number_of_images):
        image = cv2.imread(f"{path}/{filename}{i + 1}.jpg")
        images.append(image)
    return images


good_images = load_images("data/good", "goodposture")
bad_images = load_images("data/bad", "slouched")


def get_landmarks(images):
    all_landmarks = []
    for image in images:
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = pose.process(rgb_image)
        landmarks = []
        for name in landmark_names:
            idx = mp_pose.PoseLandmark[name.upper()].value
            lm = results.pose_landmarks.landmark[idx]
            landmarks.append([lm.x, lm.y, lm.z, lm.visibility])
        all_landmarks.append(landmarks)
    return all_landmarks


def normalize_landmarks(all_landmarks):
    all_normalized_landmarks = []

    return all_normalized_landmarks


good_landmarks = get_landmarks(good_images)
bad_landmarks = get_landmarks(bad_images)
