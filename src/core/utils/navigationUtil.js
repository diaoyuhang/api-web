class NavigationUtil {
  navigate;

  setNavigate(navigateFunction) {
    this.navigate = navigateFunction;
  }

  goTo(path) {
    if (this.navigate) {
      this.navigate(path);
    }
  }
}

export default new NavigationUtil();
