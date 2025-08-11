FROM python:latest

RUN apt-get update && apt-get -y upgrade
RUN apt-get install -y --no-install-recommends \
  git \
  wget \
  g++ \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

ENV PATH="/root/miniconda3/bin:${PATH}"
ARG PATH="/root/miniconda3/bin:${PATH}"

# Get the miniconda bash file
RUN wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh

# Run the file then delete it
RUN bash Miniconda3-latest-Linux-x86_64.sh -b
RUN rm -f Miniconda3-latest-Linux-x86_64.sh

RUN echo "Running the following miniconda version: $(conda --version)"

RUN conda init bash
RUN conda update conda

RUN conda create -n posturai
RUN conda activate posturai

RUN conda install python jupyter
