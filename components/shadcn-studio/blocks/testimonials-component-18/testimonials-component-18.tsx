import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'

export type TestimonialItem = {
  name: string
  role: string
  company: string
  avatar: string
  rating: number
  content: string
}

type TestimonialsComponentProps = {
  testimonials: TestimonialItem[]
}

const TestimonialsComponent = ({ testimonials }: TestimonialsComponentProps) => {
  return (
    <section className='py-16 sm:py-24'>
      <Carousel
        className='mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 md:gap-11 px-6 sm:px-6 lg:px-8 md:grid-cols-2'
        opts={{
          align: 'start',
          slidesToScroll: 1
        }}
      >
        {/* Left Content */}
        <div className='space-y-4 md:space-y-16'>
          <div className='space-y-4'>
            <h2 className='text-3xl md:text-5xl font-bold tracking-tight'>
              Trusted by <span className="bg-linear-to-r from-primary via-sky-500 to-cyan-400 bg-clip-text text-transparent">Families</span> and <span className="bg-linear-to-r from-primary via-sky-500 to-cyan-400 bg-clip-text text-transparent">Businesses</span>
            </h2>
            <p className='text-muted-foreground text-sm sm:text-lg'>
              Our customers love our products, and we love them for it. Here’s what they have to say
            </p>
          </div>

          <div className='flex items-center gap-5'>
            <CarouselPrevious
              variant='default'
              className='disabled:bg-primary/10 disabled:text-primary static size-9 translate-y-0 disabled:opacity-100'
            />
            <CarouselNext
              variant='default'
              className='disabled:bg-primary/10 disabled:text-primary static size-9 translate-y-0 disabled:opacity-100'
            />
          </div>
        </div>

        {/* Right Testimonial Carousel */}
        <div className='relative'>
          <CarouselContent className='-ml-4 sm:-ml-6'>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className='pl-4 sm:pl-6'>
                <div className='flex flex-col gap-10'>
                  <div className='space-y-2'>
                    <p className='h-14 text-8xl'>&ldquo;</p>
                    <p className='text-sm sm:text-sm lg:text-lg text-justify'>
                      {testimonial.content}
                    </p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Avatar className='size-12 rounded-full'>
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback className='rounded-full text-sm'>
                        {testimonial.name
                          .split(' ', 2)
                          .map(n => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>

                    <div className='flex-1'>
                      <h4 className='text-lg font-medium'>{testimonial.name}</h4>
                      <p className='text-muted-foreground'>
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </div>
      </Carousel>
    </section>
  )
}

export default TestimonialsComponent
