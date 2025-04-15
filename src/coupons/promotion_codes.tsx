// src/data/promoCodes.ts

export type PromoCode = {
    code: string;
    type: "flat" | "percentage";
    value: number;
    minOrderValue: number;
    maxDiscount?: number;
    description: string; // Add description field
  };
  
  export const promoCodes: PromoCode[] = [
    { code: "SAVE10", type: "percentage", value: 10, minOrderValue: 300, maxDiscount: 100, description: "Save 10% on orders above ₹300." },
    { code: "SAVE20", type: "percentage", value: 20, minOrderValue: 500, maxDiscount: 150, description: "Save 20% on orders above ₹500." },
    { code: "FLAT150", type: "flat", value: 150, minOrderValue: 400, description: "Flat ₹150 off on orders above ₹400." },
    { code: "FLAT200", type: "flat", value: 200, minOrderValue: 600, description: "Flat ₹200 off on orders above ₹600." },
    { code: "NEWUSER100", type: "flat", value: 100, minOrderValue: 250, description: "₹100 off for new users on orders above ₹250." },
    { code: "DEAL50", type: "percentage", value: 15, minOrderValue: 350, maxDiscount: 80, description: "Save 15% on orders above ₹350, max discount ₹80." },
    { code: "FESTIVE25", type: "percentage", value: 25, minOrderValue: 800, maxDiscount: 200, description: "Save 25% on festive season orders above ₹800." },
    { code: "WELCOME75", type: "flat", value: 75, minOrderValue: 200, description: "₹75 off on orders above ₹200 for new customers." },
    { code: "BIGSAVE", type: "percentage", value: 30, minOrderValue: 1000, maxDiscount: 250, description: "Save 30% on orders above ₹1000, max discount ₹250." },
    { code: "HOTDEAL", type: "flat", value: 120, minOrderValue: 450, description: "₹120 off on orders above ₹450." },
  ];