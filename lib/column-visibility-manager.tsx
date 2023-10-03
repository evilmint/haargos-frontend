type VisibilityState = { [key: string]: boolean };

export class ColumnVisibilityManager {
  private defaultVisibility: VisibilityState;
  private visibility: VisibilityState | null;
  private localStorageKey: string;

  constructor(defaultVisibility: VisibilityState, localStorageKey: string) {
    this.defaultVisibility = defaultVisibility;
    this.visibility = null;
    this.localStorageKey = localStorageKey;
  }

  private getSavedVisibility(): VisibilityState | null {
    const savedVisibility = localStorage.getItem(this.localStorageKey);
    return savedVisibility ? JSON.parse(savedVisibility) : null;
  }

  public getVisibility(): VisibilityState {
    if (!this.visibility) {
      const savedVisibility = this.getSavedVisibility();
      this.visibility = savedVisibility ?? this.defaultVisibility;
    }
    return this.visibility;
  }

  public setVisibility(newVisibility: VisibilityState): void {
    this.visibility = newVisibility;
    this.saveVisibility();
  }

  private saveVisibility(): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.visibility));
  }
}
