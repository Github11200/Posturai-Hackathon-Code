import torch

def accuracy_fn(y_true, y_preds):
  correct = torch.eq(y_true, y_preds).sum().item()
  percent = (correct / len(y_preds)) * 100
  return percent

def logits_to_labels(y_logits):
  y_pred_probs = torch.softmax(y_logits, dim=1)
  y_preds = torch.argmax(y_pred_probs, dim=1)
  return y_preds
