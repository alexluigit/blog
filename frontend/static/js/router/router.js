import routes from './routes.js'

class Router {
  constructor(routes) {
    this.routes = routes
  }

  pathToRegex(path) {
    return new RegExp('^' + path.replace(/\//g, '\\/').replace(/:\w+/g, '(.+)') + '$')
  }

  getParams(match) {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1])
    return Object.fromEntries(keys.map((key, i) => {
      return [key, values[i]];
    }))
  }

  navigateTo(path) {
    history.pushState(null, null, path);
    this.render()
  }

  matchRoute() {
    for (const route of this.routes) {
      let result = location.pathname.match(this.pathToRegex(route.path))
      if (result) return { route, result }
    }
  }

  async render() {
    const match = this.matchRoute()
    if (!match) { this.navigateTo('/404'); return }
    const refreshView = new match.route.view(this.getParams(match))
    console.log(this.getParams(match))
    document.querySelector("#app").innerHTML = await refreshView.getHtml()
  }
}

export default new Router(routes)
