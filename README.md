# Data Visualization course at UCU - Course Project

This visualization aims to visualize different perfumes.

## Project structure

Project root contains two parts of the project: Svelte frontend code with the actual visualization and [Python Jupyter notebook](./prepare-data.ipynb) for pre-processing of the [Parfumo Fragrance Dataset](https://www.kaggle.com/datasets/olgagmiufana1/parfumo-fragrance-dataset).

## Running locally

To run the visualization:
```shell
yarn install
yarn dev
```

In order to run the Jupyter notebook:

```shell
uv venv # Create venv locally
uv pip install -r pyproject.toml # Install deps

# Select the kernel in VSCode from the created .venv folder in the notebook.
```

## Deployment

Performed automatically, on `main` branch push.
