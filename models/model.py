import torch
import torch.nn as nn
import pandas as pd
import numpy as np
import json
from sklearn.model_selection import train_test_split
from utils import *

device = "cuda"
torch.device(device=device)

MANUAL_SEED = 42
LEARNING_RATE = 0.002
HIDDEN_UNITS = 32
TEST_SIZE = 0.1

torch.manual_seed(MANUAL_SEED)
torch.cuda.manual_seed(MANUAL_SEED)

# Load the data
def load_data(file_name: str):
  data = None
  with open(file_name, 'r') as f:
    data = json.load(f)
  
  landmarks = []
  labels = []
  for pose in data:
    landmarks.append(pose[0])
    labels.append(pose[1])
  
  landmarks = torch.tensor(landmarks, dtype=torch.float).to(device=device)
  labels = torch.tensor(labels, dtype=torch.long).to(device=device)

  X_train, X_test, Y_train, Y_test = train_test_split(landmarks,
                                                      labels,
                                                      test_size=TEST_SIZE,
                                                      random_state=MANUAL_SEED)

  X_train.to(device)
  X_test.to(device)
  Y_train.to(device)
  Y_test.to(device)

  # Reshape the data
  X_train = X_train.view(X_train.size(0), -1)
  X_test = X_test.view(X_test.size(0), -1)

  return X_train, X_test, Y_train, Y_test

X_train, X_test, Y_train, Y_test = load_data("data2.json")

def train_model(model_name: str, model: nn.Sequential, loss_fn, optimizer, epochs: int, should_print: bool):
  train_losses = []
  test_losses = []

  previous_test_loss = float('inf')
  for epoch in range(epochs):
    model.train()

    logits = model(X_train)
    preds = logits_to_labels(logits)

    loss = loss_fn(logits, Y_train)
    train_losses.append(loss)
    accuracy = accuracy_fn(y_true=Y_train, y_preds=preds)

    optimizer.zero_grad()
    loss.backard()
    optimizer.step()

    with torch.inference_mode():
      test_logits = model(X_test)
      test_preds = logits_to_labels(test_logits)

      test_loss = loss_fn(test_logits, Y_test)
      test_losses.append(test_loss)
      test_accuracy = accuracy_fn(y_true=Y_test, y_preds=test_preds)

      if test_loss > previous_test_loss and test_accuracy >= 90:
        print(f"\nWARNING: {model_name} overfit :(\n")
        break
      previous_test_loss = test_logits
    
    if should_print and epoch % 10 == 0:
      print(f"Epoch {epoch} | Train loss: {loss:.4f} | Train accuracy: {accuracy:.2f}% | Test loss: {test_loss:.4f} | Test accuracy: {test_accuracy:.2f}%")

