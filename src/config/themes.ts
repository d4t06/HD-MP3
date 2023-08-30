import { ThemesType } from "../types";

export const themes : ThemesType  = {
   red : {
      id: "red",
      type: 'dark',
      bottom_player_bg: 'bg-[#3b1113]',
      side_bar_bg: "bg-[#391b1c]",
      content_text: "text-[#ca4954]",
      content_hover_text: "hover:text-[#ca4954]",
      content_bg: "bg-[#ca4954]",
      content_hover_bg: "hover:bg-[#ca4954]",
      container: 'bg-[#2e0f10]'
   },
   deep_blue : {
      id: "deep_blue",
      type: 'dark',
      bottom_player_bg: 'bg-[#111f3b]',
      side_bar_bg: "bg-[#1b2639]",
      content_text: "text-[#0c9e85]",
      content_hover_text: "hover:text-[#0c9e85]",
      content_bg: "bg-[#0c9e85]",
      content_hover_bg: "hover:bg-[#0c9e85]",
      container: 'bg-[#0f1a2e]'
   },
   green_light : {
      id: "green_light",
      type: 'light',
      bottom_player_bg: 'bg-[#c0d8d8]',
      side_bar_bg: "bg-[#dde5e5]",
      content_text: "text-[#198585]",
      content_hover_text: "hover:text-[#198585]",
      content_bg: "bg-[#198585]",
      content_hover_bg: "hover:bg-[#198585]",
      container: 'bg-[#ced9d9]'
   },

}
