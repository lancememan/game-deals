const About = () => {
  return (
    <section className="bg-background text-foreground text-center p-7 md:p-16">
      <div className="container mx-auto w-[900] mx-full">
        <h1 className="text-2xl md:text-3xl font-bold mb-5">
          About Game Deals
        </h1>
        <p className="text-left text-base mb-5 text-white/80">Game Deals is a passion project built to help gamers discover the best discounts on PC games. By leveraging the CheapShark API, we fetch the latest deals from Steam and present them in a simple, user-friendly way.</p>
        <p className="text-left text-base text-white/80">Instead of endlessly scrolling through storefronts, you can quickly see which titles are on sale, compare prices, and grab the best offers without hassle</p>      
        <h1 className="text-2xl md:text-3xl font-bold mb-5 mt-10">
          Why CheapShark?
        </h1>
        <p className="text-left text-base mb-5 text-white/80">CheapShark is a trusted API that aggregates game deals from multiple sources, with Steam being one of the biggest. You can learn more about their platform and explore deals directly at <a href="https://www.cheapshark.com" className="text-blue-400">cheapshark.com</a>.</p>
      </div>
    </section>  
  )
}

export default About