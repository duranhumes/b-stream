import * as escape from 'escape-html'

export default class Controller {
    formatSlug = (slug: string) => {
        return this.escapeString(slug)
            .replace(/\s+/g, '-')
            .toLowerCase()
    }

    escapeString = (str: string) => {
        return escape(String(str))
    }
}
