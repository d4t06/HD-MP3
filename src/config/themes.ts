import { ThemeType } from "../types";

export const themes: ThemeType[] = [
   {
      name: "Red",
      id: "red",
      type: "dark",
      bottom_player_bg: "bg-[#3b1113]",
      side_bar_bg: "bg-[#391b1c]",
      content_text: "text-[#ca4954]",
      content_hover_text: "hover:text-[#ca4954]",
      content_border: "border-[#ca4954]",
      content_hover_border: "hover:border-[#ca4954]",

      content_bg: "bg-[#ca4954]  text-[#fff]",
      content_hover_bg: "hover:bg-[#ca4954] hover:text-[#fff] ",
      container: "bg-[#2e0f10]",
   },
   {
      name: "Deep blue",
      id: "deep_blue",
      type: "dark",
      bottom_player_bg: "bg-[#111f3b]",
      side_bar_bg: "bg-[#1b2639]",
      content_text: "text-[#0c9e85]",
      content_hover_text: "hover:text-[#0c9e85]",
      content_border: "border-[#0c9e85]",
      content_hover_border: "hover:border-[#0c9e85]",

      content_bg: "bg-[#0c9e85]  text-[#fff]",
      content_hover_bg: "hover:bg-[#0c9e85] hover:text-[#fff] ",
      container: "bg-[#0f1a2e]",
   },
   {
      name: "Light green",
      id: "green_light",
      type: "light",
      bottom_player_bg: "bg-[#c0d8d8]",
      side_bar_bg: "bg-[#dde5e5]",
      content_text: "text-[#198585]",
      content_hover_text: "hover:text-[#198585]",
      content_border: "border-[#198585]",
      content_hover_border: "hover:border-[#198585]",

      content_bg: "bg-[#198585] text-[#fff]",
      content_hover_bg: "hover:bg-[#198585] hover:text-[#fff]",
      container: "bg-[#ced9d9]",
   },
   {
      name: "Gray",
      id: "gray",
      type: "light",
      bottom_player_bg: "bg-[#dedad1]",
      side_bar_bg: "bg-[#d9d7d4]",
      content_text: "text-[#644646]",
      content_hover_text: "hover:text-[#644646]",
      content_border: "border-[#644646]",
      content_hover_border: "hover:border-[#644646]",

      content_bg: "bg-[#644646]  text-[#fff]",
      content_hover_bg: "hover:bg-[#644646] hover:text-[#fff]",
      container: "bg-[#e5e3df]",
   },
];
