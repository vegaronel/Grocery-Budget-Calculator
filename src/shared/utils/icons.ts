export const getIconForItem = (name: string): string => {
  if (!name) return '🛒';
  const lowerName = name.toLowerCase();
  
  // Produce/Fruits
  if (lowerName.includes('apple')) return '🍎';
  if (lowerName.includes('banana')) return '🍌';
  if (lowerName.includes('orange')) return '🍊';
  if (lowerName.includes('lemon') || lowerName.includes('lime')) return '🍋';
  if (lowerName.includes('grapes')) return '🍇';
  if (lowerName.includes('strawberry') || lowerName.includes('berries')) return '🍓';
  if (lowerName.includes('watermelon')) return '🍉';
  if (lowerName.includes('peach')) return '🍑';
  
  // Vegetables
  if (lowerName.includes('carrot')) return '🥕';
  if (lowerName.includes('tomato')) return '🍅';
  if (lowerName.includes('potato')) return '🥔';
  if (lowerName.includes('onion') || lowerName.includes('garlic')) return '🧅';
  if (lowerName.includes('broccoli')) return '🥦';
  if (lowerName.includes('corn')) return '🌽';
  if (lowerName.includes('pepper') || lowerName.includes('capsicum')) return '🫑';

  // Meat & Proteins
  if (lowerName.includes('chicken') || lowerName.includes('poultry')) return '🍗';
  if (lowerName.includes('beef') || lowerName.includes('steak') || lowerName.includes('pork') || lowerName.includes('meat')) return '🥩';
  if (lowerName.includes('fish') || lowerName.includes('salmon')) return '🐟';
  if (lowerName.includes('shrimp') || lowerName.includes('prawn')) return '🦐';
  if (lowerName.includes('egg')) return '🥚';

  // Dairy & Alternatives
  if (lowerName.includes('milk')) return '🥛';
  if (lowerName.includes('cheese')) return '🧀';
  if (lowerName.includes('butter')) return '🧈';

  // Bakery & Grains
  if (lowerName.includes('bread') || lowerName.includes('loaf')) return '🍞';
  if (lowerName.includes('rice')) return '🍚';
  if (lowerName.includes('pasta') || lowerName.includes('spaghetti') || lowerName.includes('noodles')) return '🍝';
  if (lowerName.includes('bagel')) return '🥯';

  // Snacks & Sweets
  if (lowerName.includes('cookie') || lowerName.includes('biscuit')) return '🍪';
  if (lowerName.includes('chocolate')) return '🍫';
  if (lowerName.includes('chips') || lowerName.includes('crisps') || lowerName.includes('doritos')) return '🧂'; 
  if (lowerName.includes('candy') || lowerName.includes('sweets')) return '🍬';
  if (lowerName.includes('ice cream')) return '🍦';

  // Beverages
  if (lowerName.includes('water')) return '💧';
  if (lowerName.includes('coffee')) return '☕';
  if (lowerName.includes('tea')) return '🍵';
  if (lowerName.includes('juice')) return '🧃';
  if (lowerName.includes('soda') || lowerName.includes('coke') || lowerName.includes('pepsi')) return '🥤';
  if (lowerName.includes('beer')) return '🍺';
  if (lowerName.includes('wine')) return '🍷';

  // Cleaning & Household
  if (lowerName.includes('soap') || lowerName.includes('shampoo') || lowerName.includes('body wash')) return '🧼';
  if (lowerName.includes('tissue') || lowerName.includes('paper towel') || lowerName.includes('toilet paper')) return '🧻';
  if (lowerName.includes('detergent') || lowerName.includes('bleach')) return '🧴';

  // Categories/Defaults
  if (lowerName.includes('snack')) return '🍿';
  
  // Default Grocery icon
  return '🛒';
};
