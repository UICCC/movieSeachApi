import { AppSidebar } from "@/components/app-sidebar"
import { useState, useEffect } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Page() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchMovie = async () => {
    setLoading(true)
    try {
      const response = await fetch("http://localhost:5000/")
      if (!response.ok) {
        console.log(`HTTP Error ${response.status}`)
        setError(`HTTP Error ${response.status}`)
      }
      const data = await response.json()
      setMovies(data)
    } catch (err) {
      console.log(err)
      setError("Failed to fetch movies")
    } finally {
      setLoading(false)
    }
  }

  // Filter movies based on searchTerm (case-insensitive)
  const filterMovies = () => {
    return movies.filter(movie =>
      movie.primaryTitle.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  const filteredMovies = filterMovies()

  useEffect(() => {
    fetchMovie()
  }, [])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <div className="flex w-full max-w-sm items-center gap-2">
                  <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search movies..."
                  />
                  <Button type="button" variant="outline">
                    Go
                  </Button>
                </div>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          {loading ? (
            // Loading placeholders
            <div className="grid auto-rows-min gap-4 md:grid-cols-5">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-muted/50 aspect-square rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            // Error message
            <p>{error}</p>
          ) : filteredMovies.length === 0 ? (
            // No movies found
            <p>No movies match your search.</p>
          ) : (
            // Render filtered movie cards
            <div className="grid auto-rows-min gap-4 md:grid-cols-5">
              {filteredMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="bg-muted/50 rounded-xl overflow-hidden flex flex-col"
                >
                  {/* Poster */}
                  <img
                    src={movie.primaryImage}
                    alt={movie.primaryTitle}
                    className="aspect-[2/3] object-cover w-full"
                  />

                  {/* Title */}
                  <h3 className="text-sm font-semibold mt-2 px-2 truncate">
                    {movie.primaryTitle}
                  </h3>

                  {/* Year + Rating */}
                  <p className="text-xs text-muted-foreground px-2 mb-2">
                    ({movie.startYear}) ⭐ {movie.averageRating || "N/A"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
