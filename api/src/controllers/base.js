export default class BaseController {
    constructor(model) {
        this.model = model;
    }
    async findAll(req, res) {
        try {
            const data = await this.model.findAll();
            res.status(200).json({ status: 'success', data });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
    async findById(req, res) {
        const { id } = req.params;
        try {
            const data = await this.model.findById(id);
            if (!data) {
                return res.status(404).json({ status: 'error', message: 'Not found' });
            }
            res.status(200).json({ status: 'success', data });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
    async create(req, res) {
        try {
            const data = await this.model.create(req.body);
            res.status(201).json({ status: 'success', data });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
    async update(req, res) {
        const { id } = req.params;
        try {
            const data = await this.model.update(id, req.body);
            if (!data) {
                return res.status(404).json({ status: 'error', message: 'Not found' });
            }
            res.status(200).json({ status: 'success', data });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
    async delete(req, res) {
        const { id } = req.params;
        try {
            const data = await this.model.delete(id);
            if (!data) {
                return res.status(404).json({ status: 'error', message: 'Not found' });
            }
            res.status(204).json({ status: 'success', message: 'Deleted successfully' });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
}