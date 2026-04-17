const supabase = require('../config/supabase');
const slugify = require('../utils/slugify');

const normalizeProductPayload = (body = {}) => {
  const normalized = {
    ...body,
    slug: body.slug ? slugify(body.slug) : slugify(body.name || ''),
    price: body.price !== undefined ? Number(body.price) : undefined,
    old_price: body.old_price === '' || body.old_price === null ? null : Number(body.old_price),
    discount: body.discount !== undefined ? Number(body.discount) : 0,
    stock: body.stock !== undefined ? Number(body.stock) : 0,
  };

  if (Array.isArray(body.sizes)) {
    normalized.details = {
      ...(body.details || {}),
      sizes: body.sizes,
    };
  }

  return normalized;
};

const createProduct = async (req, res, next) => {
  try {
    const payload = normalizeProductPayload(req.body);

    const { data, error } = await supabase
      .from('products')
      .insert([payload])
      .select('*, categories(name, slug)')
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const { search = '', category = '', featured = '' } = req.query;

    let query = supabase
      .from('products')
      .select('*, categories(name, slug)')
      .order('created_at', { ascending: false });

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }

    if (category) {
      query = query.eq('categories.slug', category);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json(data || []);
  } catch (error) {
    next(error);
  }
};

const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name, slug)')
      .eq('slug', slug)
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const payload = normalizeProductPayload(req.body);

    const { data, error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', req.params.id)
      .select('*, categories(name, slug)')
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductBySlug,
  updateProduct,
  deleteProduct,
};
