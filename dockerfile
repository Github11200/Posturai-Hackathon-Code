FROM nvidia/cuda:12.9.0-base-ubuntu24.04

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV NVIDIA_VISIBLE_DEVICES=all
ENV NVIDIA_DRIVER_CAPABILITIES=compute,utility
ENV CONDA_PLUGINS_AUTO_ACCEPT_TOS=yes


# Install necessary tools in one RUN command for efficiency and cleanup
RUN apt-get update && apt-get install -y wget git && rm -rf /var/lib/apt/lists/*

# Install Miniconda
RUN wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O miniconda.sh && \
  bash miniconda.sh -b -p /miniconda && \
  rm miniconda.sh

ENV PATH="/miniconda/bin:${PATH}"

# Accept conda terms of service to avoid prompts
RUN conda tos accept --override-channels --channel https://repo.anaconda.com/pkgs/main && \
  conda tos accept --override-channels --channel https://repo.anaconda.com/pkgs/r

# Conda packages
RUN conda install -y python=3.10
RUN conda install -y jupyter ipykernel pandas numpy opencv -c conda-forge

# Pip packages
RUN pip install --upgrade pip && pip install torch torchvision --index-url https://download.pytorch.org/whl/cu129
RUN pip install reflex

CMD ["bash"]
