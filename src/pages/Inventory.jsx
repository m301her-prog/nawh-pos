useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const response = await neonService.getProducts();
        
        // تعديل هنا: تأكد من شكل البيانات العائدة
        // إذا كان response هو المصفوفة مباشرة:
        const data = Array.isArray(response) ? response : (response?.data || response?.rows || []);
        
        setProducts(data);
      } catch (err) {
        console.error("خطأ في جلب المخزون:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);
