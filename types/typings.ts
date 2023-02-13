export type UserDetails = {
  fname: string;
  lname: string;
  email: string;
  image: string;
  profession: string;
  bio: string;
  age: string;
  username: string;
  gender: string;
};

export type ModalContent = {
  title: string;
  confirmTitle: string;
  action: any;
  description: string;
  possitive?: boolean;
};

export type Dish = {
  name: string;
  calories: number;
  carbohydrates: number;
  fat: number;
  proteins: number;
  nutrients: any;
};

export type UserCharacteristics = {
  body_frame: string;
  body_build_and_musculature: string;
  complexion: string;
  skin: string;
  teeth: string;
  nails: string;
  eyes: string;
  lips: string;
  hair: string;
  weight: string;
  movements_and_physical_activities: string;
  tolerance_for_seasonal_weather: string;
  disease_resistant_and_healing_capacity: string;
  food_habits: string;
  appetite: string;
  digestion: string;
  bowel_movements: string;
  liking_towards_various_taste: string;
  communication_speech: string;
  capabilities_activity_level: string;
  memory_intellectual_level: string;
  ageing: string;
  emotions: string;
  sleep: string;
  personality_strengths: string;
  featured_traits: string;
  email: string;
};

export type FoodItem = {
  image: string;
  name: string;
  calories: number;
  carbohydrates: number;
  fat: number;
  proteins: number;
  nutrients: any;
  date: string;
};
