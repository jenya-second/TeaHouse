import { joke, jokeSubcategory } from '#pages/TeaPal.js';
import { GetProducts } from '#utils/requests.js';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ProductEntity } from '@tea-house/types';

export interface CatalogsState {
    value: {
        allCategories: joke[];
        deliveryCategories: joke[];
    };
}

const init: CatalogsState = {
    value: { allCategories: [], deliveryCategories: [] },
};

export const fetchCatalogs = createAsyncThunk('fetchProducts', async () => {
    return await GetProducts();
});

export const catalogsSlice = createSlice({
    name: 'catalogs',
    initialState: init,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchCatalogs.fulfilled, (state, action) => {
            if (!action.payload) return state;
            const categories = action.payload;
            const newCategories: joke[] = [];
            const deliveryCat: joke[] = [];
            const d: joke[] = [];
            for (const category of categories ?? []) {
                if (!category.parentCategory) {
                    const z = { ...category, mySubcat: [] };
                    newCategories.push(z);
                    if (category.name.includes('*')) deliveryCat.push(z);
                }
            }
            for (const category of newCategories) {
                const subcategories: jokeSubcategory[] = [];
                for (const sub of category.subcategories) {
                    const subcat = categories?.find((c) => c.id == sub.id);
                    if (!subcat) continue;
                    subcategories.push({
                        ...subcat,
                        myProducts: subcat.products,
                    });
                }
                category.subcategories = subcategories;
                category.mySubcat = subcategories;
            }
            for (let i = 0; i < deliveryCat.length; i++) {
                d.push({ ...deliveryCat[i] });
                const subcategories: jokeSubcategory[] = [];
                deliveryCat[i].subcategories.forEach((val) => {
                    const a: (ProductEntity & { rank?: number })[] = [];
                    const sub = { ...val, myProducts: a };
                    sub.products = val.products.filter((val) => {
                        const countInGr = val.press
                            ? val.pressAmount / (val.pressAmount >= 200 ? 2 : 1)
                            : 25;
                        const max = Math.floor(val.balance / countInGr);
                        return max > 0;
                    });
                    sub.myProducts = sub.products;
                    subcategories.push(sub);
                });
                d[i].subcategories = subcategories;
                d[i].mySubcat = subcategories;
            }
            for (let i = 0; i < d.length; i++) {
                d[i].subcategories = d[i].subcategories.filter(
                    (val) => val.products.length != 0,
                );
                d[i].mySubcat = d[i].mySubcat.filter(
                    (val) => val.products.length != 0,
                );
            }
            return {
                value: { allCategories: newCategories, deliveryCategories: d },
            };
        });
    },
});

export default catalogsSlice.reducer;
