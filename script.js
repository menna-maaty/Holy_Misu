// ============ DATA ============
const CHEESECAKES = [
  {
    id: "berries",
    name: "Berry Cheesecake",
    image: "berres1.jpg",
    basePrice: 380,
    mediumExtra: 40,
    largeExtra: 100,
    flavors: ["Blueberry", "Raspberry", "Blackberry"],
  },

  {
    id: "caramel",
    name: "Caramel Cheesecake",
    image: "caram.jpg",
    basePrice: 340,
    mediumExtra: 40,
    largeExtra: 100,
    flavors: ["Caramel"],
  },

  {
    id: "pecan",
    name: "Caramel Pecan Cheesecake",
    image: "pecan4.jpg",
    basePrice: 490,
    mediumExtra: 40,
    largeExtra: 110,
    flavors: ["Caramel Pecan"],
  },

  {
    id: "snickers",
    name: "Snickers Cheesecake",
    image: "sni.jpg",
    basePrice: 370,
    mediumExtra: 40,
    largeExtra: 70,
    flavors: ["snickers"],
  },

  {
    id: "strawberry",
    name: "Strawberry Cheesecake",
    image: "str.jpg",
    basePrice: 360,
    mediumExtra: 40,
    largeExtra: 90,
    flavors: ["Strawberry"],
  },
];

const MINI_BOX = {
  id: "mini-box",
  name: "Share Box",
  image: "mini5.jpg",

  flavors: [
    
    "Kinder Bueno White",
    "Blueberry",
    "Raspberry",
    "Blackberry",
    "Caramel",
    "Caramel Pecan",
    "Strawberry",
  ],

  sizes: [
    { count: 3, price: 180 },
    { count: 6, price: 250 },
    { count: 12, price: 340 },
  ],
};

const BIRTHDAY_SURCHARGE = 45;

// ============ HELPERS ============
const $ = (sel, root = document) => root.querySelector(sel);

const el = (tag, attrs = {}, ...children) => {
  const node = document.createElement(tag);

  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k === "html") node.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function")
      node.addEventListener(k.slice(2), v);
    else if (v !== false && v != null)
      node.setAttribute(k, v);
  }

  for (const c of children.flat()) {
    if (c == null || c === false) continue;

    node.appendChild(
      typeof c === "string"
        ? document.createTextNode(c)
        : c
    );
  }

  return node;
};

function toast(msg) {
  const t = $("#toast");

  t.textContent = "✓ " + msg;
  t.hidden = false;

  clearTimeout(toast._t);

  toast._t = setTimeout(() => {
    t.hidden = true;
  }, 2600);
}

// ============ OPTIONS ============
function makeOption({
  name,
  value,
  checked,
  label,
  meta,
  extra,
  onChange
}) {

  const input = el("input", {
    type: "radio",
    name,
    value,
    ...(checked ? { checked: "" } : {})
  });

  input.addEventListener("change", () => onChange(value));

  return el(
    "label",
    { class: "opt" },

    input,

    el("span", { class: "opt__radio" }),

    el(
      "span",
      { class: "opt__label" },
      label,
      meta
        ? el("span", { class: "opt__meta" }, ` (${meta})`)
        : null
    ),

    extra
      ? el("span", { class: "opt__extra" }, extra)
      : null
  );
}

function makeOptionGroup(label, options) {

  return el(
    "div",
    { class: "opt-group" },

    el(
      "div",
      { class: "opt-group__label" },
      label
    ),

    el(
      "div",
      { class: "opt-group__list" },
      ...options
    )
  );

}
// ============ CHEESECAKE CARD ============
function buildCheesecakeCard(cake) {

  let size = "sm";
  let flavor = cake.flavors[0];

  function computePrice() {

    if (size === "md")
      return cake.basePrice + cake.mediumExtra;

    if (size === "lg")
      return cake.basePrice + cake.largeExtra;

    return cake.basePrice;

  }


  const totalEl = el(
    "div",
    { class: "card__total-value" },
    `EGP ${computePrice()}`
  );


  function update() {
    totalEl.textContent = `EGP ${computePrice()}`;
  }


  const sizeGroup = makeOptionGroup("Size", [

    makeOption({
      name: `${cake.id}-size`,
      value: "sm",
      checked: true,
      label: "18 cm",
      meta: "serves 5",
      onChange: v => {
        size = v;
        update();
      }
    }),


    makeOption({
      name: `${cake.id}-size`,
      value: "md",
      label: "20 cm",
      meta: "serves 7",
      extra: `+EGP ${cake.mediumExtra}`,
      onChange: v => {
        size = v;
        update();
      }
    }),


    makeOption({
      name: `${cake.id}-size`,
      value: "lg",
      label: "23 cm",
      meta: "serves 9",
      extra: `+EGP ${cake.largeExtra}`,
      onChange: v => {
        size = v;
        update();
      }
    })

  ]);


  const flavorGroup = makeOptionGroup(
    "Flavor",

    cake.flavors.map((f, i) =>
      makeOption({
        name: `${cake.id}-flavor`,
        value: f,
        checked: i === 0,
        label: f,
        onChange: v => {
          flavor = v;
        }
      })
    )
  );


  const panel = el(

    "div",
    { class: "card__panel" },

    sizeGroup,

    flavorGroup,


    el(
      "div",
      { class: "card__total" },

      el(
        "div",
        {},

        el(
          "div",
          { class: "card__total-label" },
          "Total"
        ),

        totalEl

      ),


      el(
        "button",
        {
          class: "btn btn--primary btn--sm",

          onclick: () => {

            let sizeText = "18cm";

            if (size === "md")
              sizeText = "20cm";

            if (size === "lg")
              sizeText = "23cm";


            toast(
              `Added ${cake.name} (${flavor}) · ${sizeText} — EGP ${computePrice()}`
            );

          }
        },

        "Add to Bag"

      )

    )

  );



  const toggle = el(

    "button",

    {
      class: "card__toggle",
      "aria-expanded": "false"
    },


    el(
      "span",
      { class: "label" },
      "Product Details"
    ),


    el(
      "span",
      { class: "chev" },
      "▾"
    )

  );



  const imgBtn = el(

    "button",

    {
      class: "card__img-wrap",
      type: "button"
    },


    el(
      "img",
      {
        src: cake.image,
        alt: cake.name,
        loading: "lazy"
      }
    ),


    el(
      "span",
      {
        class: "card__price-tag"
      },

      `From EGP ${cake.basePrice}`

    )

  );



  function togglePanel() {

    const open = panel.classList.toggle("open");


    toggle.setAttribute(
      "aria-expanded",
      open ? "true" : "false"
    );


    toggle.querySelector(".label").textContent =
      open
        ? "Hide options"
        : "Product Details";

  }



  toggle.addEventListener(
    "click",
    togglePanel
  );


  imgBtn.addEventListener(
    "click",
    togglePanel
  );



  return el(

    "article",

    {
      class: "card"
    },


    imgBtn,


    el(
      "div",
      {
        class: "card__body"
      },


      el(
        "h3",
        {
          class: "card__title"
        },

        cake.name

      ),


      el(
        "p",
        {
          class: "card__sub"
        },

        "Baked Cheesecake"

      ),


      toggle,


      panel

    )

  );

}
// ============ MINI BOX CARD ============
function buildMiniBoxCard() {

  let size = MINI_BOX.sizes[0];

  const totalEl = el(
    "div",
    { class: "card__total-value" },
    `EGP ${size.price}`
  );

  function update() {
    totalEl.textContent = `EGP ${size.price}`;
  }


  const sizeGroup = makeOptionGroup(
    "Box Size",

    MINI_BOX.sizes.map((s, i) =>

      makeOption({

        name: "mini-size",

        value: String(s.count),

        checked: i === 0,

        label: `${s.count} pieces`,

        extra: `EGP ${s.price}`,

        onChange: v => {

          size = MINI_BOX.sizes.find(
            x => String(x.count) === v
          );

          update();

        }

      })

    )

  );


  const flavors = el(

    "div",

    {},

    el(
      "div",
      { class: "opt-group__label" },
      "Available Flavors"
    ),


    el(

      "div",

      { class: "chips" },

      ...MINI_BOX.flavors.map(
        f =>
          el(
            "span",
            { class: "chip" },
            f
          )
      )

    )

  );


  const panel = el(

    "div",

    { class: "card__panel" },

    flavors,

    sizeGroup,


    el(

      "div",

      { class: "card__total" },


      el(

        "div",

        {},

        el(
          "div",
          { class: "card__total-label" },
          "Total"
        ),

        totalEl

      ),


      el(

        "button",

        {

          class: "btn btn--primary btn--sm",

          onclick: () =>

            toast(
              `Added Share Box · ${size.count} pieces — EGP ${size.price}`
            )

        },

        "Add to Bag"

      )

    )

  );



  const toggle = el(

    "button",

    {

      class: "card__toggle",

      "aria-expanded": "false"

    },


    el(
      "span",
      { class: "label" },
      "Product Details"
    ),


    el(
      "span",
      { class: "chev" },
      "▾"
    )

  );



  const imgBtn = el(

    "button",

    {

      class: "card__img-wrap",

      type: "button"

    },


    el(

      "img",

      {

        src: MINI_BOX.image,

        alt: MINI_BOX.name,

        loading: "lazy"

      }

    ),


    el(

      "span",

      {

        class: "card__price-tag"

      },

      "From EGP 180"

    )

  );



  function togglePanel(){

    const open = panel.classList.toggle("open");


    toggle.setAttribute(

      "aria-expanded",

      open ? "true" : "false"

    );


    toggle.querySelector(".label").textContent =

      open

      ? "Hide options"

      : "Product Details";

  }



  toggle.addEventListener(
    "click",
    togglePanel
  );


  imgBtn.addEventListener(
    "click",
    togglePanel
  );



  return el(

    "article",

    {

      class: "card"

    },


    imgBtn,


    el(

      "div",

      {

        class: "card__body"

      },


      el(
        "h3",
        {
          class: "card__title"
        },
        MINI_BOX.name
      ),


      el(
        "p",
        {
          class: "card__sub"
        },
        "Assorted bite-size cheesecakes"
      ),


      toggle,


      panel

    )

  );

}// ============ BIRTHDAY SECTION ============
function buildBirthdaySection() {

  const flavorsRoot = $("#bday-flavors");
  const configRoot = $("#bday-config");

  let selectedFlavor = null;
  let size = "sm";


  // نفس الفليفرز الموجودة في Share Box
  const chipButtons = MINI_BOX.flavors.map(flavor => {

    const btn = el(

      "button",

      {

        class: "chip chip--btn",

        type: "button",

        onclick: () => {

          selectedFlavor = flavor;

          chipButtons.forEach(
            b => b.classList.remove("active")
          );

          btn.classList.add("active");

          render();

        }

      },

      flavor

    );


    return btn;

  });



  flavorsRoot.append(

    el(
      "div",
      {
        class: "opt-group__label"
      },
      "Choose a Flavor"
    ),


    el(

      "div",

      {
        class: "chips"
      },

      ...chipButtons

    )

  );




  function getFlavorData(flavor){


    switch(flavor){


      case "Caramel":

      case "Strawberry":

        return {

          basePrice:360,

          mediumExtra:40,

          largeExtra:90

        };



      case "Blueberry":

      case "Raspberry":

      case "Blackberry":

        return {

          basePrice:380,

          mediumExtra:40,

          largeExtra:100

        };



      

      case "Kinder Bueno White":

        return {

          basePrice:580,

          mediumExtra:30,

          largeExtra:110

        };



      case "Caramel Pecan":

        return {

          basePrice:490,

          mediumExtra:40,

          largeExtra:100

        };

 case "Caramel":

        return {

          basePrice:340,

          mediumExtra:40,

          largeExtra:100

        };

      default:

        return {

          basePrice:340,

          mediumExtra:50,

          largeExtra:100

        };

    }

  }





  function render(){


    configRoot.innerHTML = "";


    if(!selectedFlavor)
      return;



    const data = getFlavorData(selectedFlavor);



    function totalFor(){


      if(size === "md")

        return (

          data.basePrice +

          data.mediumExtra +

          BIRTHDAY_SURCHARGE

        );



      if(size === "lg")

        return (

          data.basePrice +

          data.largeExtra +

          BIRTHDAY_SURCHARGE

        );



      return (

        data.basePrice +

        BIRTHDAY_SURCHARGE

      );


    }




    const totalEl = el(

      "div",

      {

        class:"card__total-value"

      },

      `EGP ${totalFor()}`

    );





    function update(){

      totalEl.textContent =
        `EGP ${totalFor()}`;

    }





    const sizeGroup = makeOptionGroup(

      "Size",


      [


        makeOption({

          name:"bday-size",

          value:"sm",

          checked:size==="sm",

          label:"18 cm",

          meta:"serves 5",

          extra:
          `EGP ${data.basePrice + BIRTHDAY_SURCHARGE}`,

          onChange:v=>{

            size=v;

            update();

          }

        }),




        makeOption({

          name:"bday-size",

          value:"md",

          checked:size==="md",

          label:"20 cm",

          meta:"serves 7",

          extra:
          `EGP ${data.basePrice + data.mediumExtra + BIRTHDAY_SURCHARGE}`,

          onChange:v=>{

            size=v;

            update();

          }

        }),





        makeOption({

          name:"bday-size",

          value:"lg",

          checked:size==="lg",

          label:"23 cm",

          meta:"serves 9",

          extra:
          `EGP ${data.basePrice + data.largeExtra + BIRTHDAY_SURCHARGE}`,

          onChange:v=>{

            size=v;

            update();

          }

        })


      ]

    );






    configRoot.appendChild(

      el(

        "div",

        {

          class:"bday-panel"

        },


        sizeGroup,



        el(

          "div",

          {

            class:"card__total"

          },


          el(

            "div",

            {},


            el(

              "div",

              {

                class:"card__total-label"

              },

              "Total"

            ),


            totalEl


          ),





          el(

            "button",

            {

              class:"btn btn--primary btn--sm",


              onclick:()=>{


                let sizeText="18cm";


                if(size==="md")

                  sizeText="20cm";



                if(size==="lg")

                  sizeText="23cm";



                toast(

                  `Added Birthday ${selectedFlavor} · ${sizeText} — EGP ${totalFor()}`

                );


              }

            },

            "Add to Bag"

          )


        )


      )


    );


  }


}// ============ INIT ============

document.addEventListener("DOMContentLoaded", () => {

  const grid = $("#product-grid");


  // إضافة الكيكات
  CHEESECAKES.forEach(cake => {

    grid.appendChild(
      buildCheesecakeCard(cake)
    );

  });



  // إضافة Share Box
  grid.appendChild(
    buildMiniBoxCard()
  );



  // تشغيل قسم أعياد الميلاد
  buildBirthdaySection();



  // السنة في الفوتر
  const year = $("#year");

  if(year){

    year.textContent =
      new Date().getFullYear();

  }

});