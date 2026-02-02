const Footer = () => {
  return (
    <footer className="bg-background text-foreground mt-10 p-4 text-center border-t border-gray-200 dark:border-gray-800">
      <p>© {new Date().getFullYear()} Game Deals. All rights reserved.</p>
      <p>By: Lance Meman</p>
    </footer>
  )
}

export default Footer