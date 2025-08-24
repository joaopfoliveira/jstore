# 📏 Examples: Dynamic Size System

## Test Examples

Here are examples of how the new dynamic size system works with different product titles:

---

## 🔍 **Range-Based Examples**

### **Example 1: Basic Range**
```
Product Title: "Real Madrid Home Jersey 2024 S-XL"
Detected Sizes: S, M, L, XL
```

### **Example 2: Extended Range** 
```
Product Title: "Barcelona Training Shirt S-4XL Available"
Detected Sizes: S, M, L, XL, 2XL, 3XL, 4XL
```

### **Example 3: Traditional System Range**
```
Product Title: "Retro Real Oviedo 90/91 Home S-XXL" 
Detected Sizes: S, M, L, XL, XXL
System Used: TRADITIONAL (because end size is XXL)
```

### **Example 4: Large Numeric Sizes**
```
Product Title: "Big & Tall Jersey XL-5XL"
Detected Sizes: XL, 2XL, 3XL, 4XL, 5XL
System Used: NUMERIC (because end size is 5XL)
```

---

## 📊 **System Detection Logic**

### **Traditional System (XXL, XXXL)**
```
End size contains: XXL, XXXL, XXXXL
Result: XS, S, M, L, XL, XXL, XXXL, XXXXL

Examples:
- "S-XXL" → S, M, L, XL, XXL
- "L-XXXL" → L, XL, XXL, XXXL
```

### **Numeric System (2XL, 3XL, etc.)**
```
End size contains: 2XL, 3XL, 4XL, 5XL
Result: XS, S, M, L, XL, 2XL, 3XL, 4XL, 5XL  

Examples:
- "S-4XL" → S, M, L, XL, 2XL, 3XL, 4XL
- "XL-5XL" → XL, 2XL, 3XL, 4XL, 5XL
```

### **Basic Ranges (S-XL, M-L, etc.)**
```
Default to Traditional System
"S-XL" → S, M, L, XL
"M-L" → M, L
```

---

## 🔍 **Individual Size Examples**

### **Example 5: Specific Sizes Available**
```
Product Title: "Vintage Jersey - Available in S, L, XL only"
Detected Sizes: S, L, XL
```

### **Example 6: Limited Stock**
```
Product Title: "Limited Edition - Sizes M, XL, 2XL in stock"
Detected Sizes: M, XL, 2XL
```

---

## 🔍 **Fallback Examples**

### **Example 7: No Size Info**
```
Product Title: "Classic Football Shirt Blue"
Detected Sizes: S, M, L, XL, XXL (default)
```

### **Example 8: Generic Name**
```
Product Title: "Sports Jersey Premium Quality"
Detected Sizes: S, M, L, XL, XXL (default)
```

---

## ⚡ **Real-World Test Cases**

### **Portuguese Products**
```
Product Title: "Camisola Benfica 2024 S-4XL Disponível"
Detected Sizes: S, M, L, XL, 2XL, 3XL, 4XL
```

### **Mixed Language**
```
Product Title: "Maillot PSG Domicile M-XXL Taille"
Detected Sizes: M, L, XL, XXL
```

### **Technical Specifications**
```
Product Title: "Pro Jersey Tech Fabric - Size Range S-3XL"
Detected Sizes: S, M, L, XL, 2XL, 3XL
```

---

## 🔧 **How to Test**

### **1. Add Products to Cart**
- Product with range (S-XL) → Shows S, M, L, XL in dropdown
- Product without sizes → Shows default S, M, L, XL, 2XL

### **2. Check Size Dropdown**
- Only relevant sizes appear for each product
- Helper text shows: "Available sizes: S, M, L, XL"

### **3. Auto-Correction**
- If invalid size somehow gets selected, auto-corrects to first available

---

## 🎯 **Expected Behavior**

### **✅ What Works:**
- `S-XL` → S, M, L, XL
- `S-4XL` → S, M, L, XL, 2XL, 3XL, 4XL
- `M-XXL` → M, L, XL, XXL
- `L-5XL` → L, XL, 2XL, 3XL, 4XL, 5XL
- No size info → S, M, L, XL, 2XL (default)

### **✅ Smart Features:**
- Case insensitive: `s-xl` = `S-XL`
- Multiple ranges: Takes first match
- Auto-correction for invalid sizes
- Consistent size ordering

---

## 📊 **Testing Checklist**

- [ ] Product with S-XL shows correct sizes
- [ ] Product with S-4XL shows extended range  
- [ ] Product without sizes shows default
- [ ] Size dropdown updates per product
- [ ] Helper text shows available sizes
- [ ] Invalid sizes get auto-corrected
- [ ] Add to cart uses appropriate default size

---

**🎯 Your products now show exactly the sizes they actually have available!** 📏✨
