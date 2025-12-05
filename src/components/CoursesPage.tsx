import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { BookOpen, Clock, Users, Award, ArrowRight, Star } from 'lucide-react';
import { courses } from '../lib/data';

interface CoursesPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function CoursesPage({ onNavigate }: CoursesPageProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2>Courses</h2>
        <p className="text-neutral-600 mt-1">
          Explore and enroll in courses to advance your skills
        </p>
      </div>

      {/* Enrolled Courses */}
      <div>
        <h3 className="mb-4">My Courses</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {courses.slice(0, 2).map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription className="mt-2">{course.description}</CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      course.level === 'beginner'
                        ? 'border-green-300 text-green-700'
                        : course.level === 'intermediate'
                        ? 'border-yellow-300 text-yellow-700'
                        : 'border-red-300 text-red-700'
                    }
                  >
                    {course.level}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Course Progress</span>
                    <span>65%</span>
                  </div>
                  <Progress value={65} />
                </div>

                <div className="grid grid-cols-3 gap-4 py-3 border-y border-neutral-200">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-sm text-neutral-600 mb-1">
                      <Clock className="w-4 h-4" />
                      <span>Duration</span>
                    </div>
                    <p className="text-sm">{course.duration}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-sm text-neutral-600 mb-1">
                      <BookOpen className="w-4 h-4" />
                      <span>Lessons</span>
                    </div>
                    <p className="text-sm">{course.lessons}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-sm text-neutral-600 mb-1">
                      <Users className="w-4 h-4" />
                      <span>Students</span>
                    </div>
                    <p className="text-sm">{course.enrolled}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" style={{ backgroundColor: 'var(--color-primary)' }}>
                    Continue Learning
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button variant="outline">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recommended Courses */}
      <div>
        <h3 className="mb-4">Recommended for You</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              id: 'rec-1',
              title: 'Advanced System Design',
              level: 'advanced',
              duration: '10 weeks',
              lessons: 40,
              enrolled: 180,
              rating: 4.8,
              tags: ['System Design', 'Scalability', 'Architecture'],
            },
            {
              id: 'rec-2',
              title: 'Competitive Programming',
              level: 'intermediate',
              duration: '8 weeks',
              lessons: 32,
              enrolled: 220,
              rating: 4.9,
              tags: ['Algorithms', 'Problem Solving', 'Optimization'],
            },
            {
              id: 'rec-3',
              title: 'Database Fundamentals',
              level: 'beginner',
              duration: '6 weeks',
              lessons: 24,
              enrolled: 315,
              rating: 4.7,
              tags: ['SQL', 'NoSQL', 'Database Design'],
            },
          ].map((course) => (
            <Card key={course.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge
                    variant="outline"
                    className={
                      course.level === 'beginner'
                        ? 'border-green-300 text-green-700'
                        : course.level === 'intermediate'
                        ? 'border-yellow-300 text-yellow-700'
                        : 'border-red-300 text-red-700'
                    }
                  >
                    {course.level}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{course.rating}</span>
                  </div>
                </div>
                <CardTitle className="text-base">{course.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-neutral-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    {course.lessons} lessons
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {course.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Button variant="outline" className="w-full">
                  Enroll Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
