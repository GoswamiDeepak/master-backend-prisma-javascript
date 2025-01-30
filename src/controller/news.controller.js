export class NewsController {
    //`* all news *
    async index(req, res, next) {}

    // * create news *
    async store(req, res, next) {}

    // * single news *
    async show(req, res, next) {
        const id = req.params.id;
    }

    // * update news *
    async update(req, res, next) {
        const id = req.params.id;
    }
    
    // * delete news *
    async destroy(req, res, next) {
        const id = req.params.id;
    }
}
