// Imagens de referência usadas neste protótipo (app de teste).
// Em produção, estas viriam das fotos reais enviadas por terceiros e fiscais.
export const IMG = {
  blocoA: "https://preview.free3d.com/img/2019/07/2188282124052727683/k0y3oqhx.jpg",
  blocoB: "https://prefeitura.rio/wp-content/uploads/2024/06/Foto-5.jpg",
  blocoC: "https://prefeitura.rio/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-13-at-13.21.25.jpeg",

  gessoInstalando: "https://mab-art.com.br/wp-content/uploads/2025/09/placa-de-gesso-para-teto%E2%80%8B.jpg",
  gessoTeto: "https://sonharemorar.mrv.com.br/wp-content/uploads/2022/01/teto.jpg",
  gessoTextura: "https://atacadaodogessojarinu.com.br/assets/images/moldura-gesso.jpg",
  gessoPlacas: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaC9BL9yhE0hZdajxn6ufl8a3CHFfxGubV1uuJhgb-18ItNV6XlZJBEat7&s=10",

  pinturaOk: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_GXpKq68BIRqR2VPLZ1tHVsEmRKeNf-xxhWOlzqA2335mwcRe1UR55T5U&s=10",
  pinturaMalFeita: "https://media.licdn.com/dms/image/v2/C5612AQFMKNvSjUM0yQ/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1593638741960?e=2147483647&v=beta&t=dl9N0UuQD6aMMcXPCNZOPnb6gpL_2heSFv5cc-yiPyQ",
  paredeBrancaSala: "https://i.pinimg.com/736x/06/d6/69/06d669c327a33a07dc40c6917b0a2b03.jpg",

  emojiArquiteta: "https://images.emojiterra.com/google/android-10/512px/1f477-2640.png",
  emojiPedreiro: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbsNuc0sk03-FxLw1RC7c5IbMFJq35yH_39lPoyh8Kzw&s=10v",

  // easter egg: foto solta que "por acaso" foi parar no meio dos lançamentos.
  fotoMisteriosa: "https://i.pinimg.com/236x/12/98/0f/12980f9b45cf3660e848ca2b70f29621.jpg",

  logoGesso: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS17yzo0jWuL0vWjZufODjtJ1Ja9hrB_sGhLgmSgZPILwtKezdjbPKRQnKR&s=10",
  logoPintura: "https://thumbs.dreamstime.com/b/logotipo-home-do-reparo-da-pintura-91498642.jpg",

  esquadriasRocha: "https://img.magnific.com/vetores-gratis/logotipo-da-empresa-de-construcao-de-design-plano_23-2150051909.jpg?semt=ais_hybrid&w=740&q=80",
  metaisVaz: "https://img.magnific.com/vetores-premium/desenho-simples-do-logotipo-da-empresa-de-construcao_278222-8246.jpg?semt=ais_hybrid&w=740&q=80",
  marcenariaLopes: "https://www.designevo.com/res/templates/thumb_small/simple-construction-letter-m-a.webp",
} as const;

// Página de referência (não é imagem direta) sobre pendências de pintura.
export const LINK_PINTURA_PENDENCIA = "https://www.mapadaobra.com.br/gestao/materiais-pintura-parede/";

export const BLOCO_IMAGENS: Record<string, string> = {
  A: IMG.blocoA,
  B: IMG.blocoB,
  C: IMG.blocoC,
};
