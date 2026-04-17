const supabase = require('../config/supabase');
const slugify = require('../utils/slugify');

const createCategory = async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      slug: req.body.slug ? slugify(req.body.slug) : slugify(req.body.name || ''),
    };

    const { data, error } = await supabase
      .from('categories')
      .insert([payload])
      .select('*')
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

const getCategories = async (_req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    res.json(data || []);
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      slug: req.body.slug ? slugify(req.body.slug) : undefined,
    };

    const { data, error } = await supabase
      .from('categories')
      .update(payload)
      .eq('id', req.params.id)
      .select('*')
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
