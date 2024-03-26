class Zmount {
  size!: number;

  challenge(): string {
    return this.size.toString();
  }
}

export { Zmount };
