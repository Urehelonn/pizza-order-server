import {getRepository} from "typeorm";
import {Request, Response} from "express";
import {validate} from "class-validator";
import {ERRCODE, ERRSTR, PizzaError} from "../helper/Error";
import {Category, CategoryType} from "../entity/Category";

const columnFilter: any = {
    select: ['id', 'type', 'description', 'featured']
};

export class CategoryController {

    private static get repo() {
        return getRepository(Category);
    };

    static getCaterogies = async (req: Request, res: Response) => {
        const categories = await CategoryController.repo.find(columnFilter);
        return res.send(new PizzaError(ERRCODE.E_OK, ERRSTR.S_OK, categories));
    };

    static checkCategoryExisted = async (req: Request, res: Response) => {
        const type: CategoryType = req.params.type as CategoryType;
        const repo = CategoryController.repo;
        const numb = await repo.count({type});
        return res.send(new PizzaError(ERRCODE.E_OK,
            `Find ${numb} categories with name ${type}`, numb));
    }

    static getCategoryById = async (req: Request, res: Response) => {
        const id: string = req.params.id;

        try {
            const category = await CategoryController.repo.findOneOrFail(id, columnFilter);
            res.send(category);
        } catch (err) {
            console.log('exception caught.');
            return res.status(ERRCODE.E_NOTFOUND).send(
                new PizzaError(ERRCODE.E_NOTFOUND, ERRSTR.S_NOTFOUND));
        }
    };

    static newCategory = async (req: Request, res: Response) => {
        let {
            type, description, featured
        } = req.body;
        let category = new Category(type, description, featured);

        try {
            const err = await validate(category);
            if (err.length > 0) {
                return res.status(ERRCODE.E_BADREQUEST)
                    .send(new PizzaError(ERRCODE.E_BADREQUEST, ERRSTR.S_BADREQUEST));
            }
            await CategoryController.repo.save(category);
        } catch (e) {
            console.log('error: save category', e);
            return res.status(ERRCODE.E_BADREQUEST).send(new PizzaError(
                ERRCODE.E_BADREQUEST, `Category save failed.`, category
            ));
        }

        return res.status(ERRCODE.E_CREATED).send(
            new PizzaError(ERRCODE.E_CREATED, ERRSTR.S_CREATED, category));
    };

    static editCategory = async (req: Request, res: Response) => {
        const id = req.params.id;
        let oldCate: Category = null;

        try {
            oldCate = await CategoryController.repo.findOneOrFail(id);
        } catch (e) {
            return res.status(ERRCODE.E_NOTFOUND)
                .send(new PizzaError(ERRCODE.E_NOTFOUND, ERRSTR.S_NOTFOUND));
        }

        let {type, description, featured} = req.body;
        let cate = new Category(type, description, featured);
        cate.id = oldCate.id;

        try {
            const err = await validate(cate);
            if (err.length > 0) {
                return res.status(ERRCODE.E_BADREQUEST)
                    .send(new PizzaError(ERRCODE.E_BADREQUEST, ERRSTR.S_BADREQUEST));
            }
            await CategoryController.repo.save(cate);
        } catch (e) {
            console.log('save pizza failed: ', e);
            return res.status(ERRCODE.E_BADREQUEST).send(new PizzaError(
                ERRCODE.E_BADREQUEST, `Category save failed.`, cate
            ));
        }
        return res.status(ERRCODE.E_UPDATED)
            .send(new PizzaError(ERRCODE.E_UPDATED, ERRSTR.S_UPDATED));
    };

    static deleteCategory = async (req: Request, res: Response) => {
        const id: string = req.params.id;
        try {
            await CategoryController.repo.findOneOrFail(id);
        } catch (e) {
            return res.status(ERRCODE.E_NOTFOUND)
                .send(new PizzaError(ERRCODE.E_NOTFOUND, ERRSTR.S_NOTFOUND));
        }

        await CategoryController.repo.delete(id);

        return res.status(ERRCODE.E_UPDATED)
            .send(new PizzaError(ERRCODE.E_UPDATED, `category with id ${id} deleted.`));
    };
}