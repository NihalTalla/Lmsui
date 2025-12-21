import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, Upload, X, CheckCircle } from 'lucide-react';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { courses } from '../lib/data';
import { toast } from 'sonner@2.0.3';

export function CSVBatchDialog() {
  const [uploadMethod, setUploadMethod] = useState<'manual' | 'csv'>('manual');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvStudents, setCsvStudents] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a valid CSV file');
      return;
    }

    setCsvFile(file);

    // Read and parse CSV
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        toast.error('CSV file is empty or invalid');
        return;
      }

      // Parse CSV (assuming format: name,email)
      const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
      const nameIndex = headers.findIndex(h => h.includes('name'));
      const emailIndex = headers.findIndex(h => h.includes('email'));

      if (nameIndex === -1 || emailIndex === -1) {
        toast.error('CSV must contain "name" and "email" columns');
        return;
      }

      const students = lines.slice(1).map((line, index) => {
        const values = line.split(',').map(v => v.trim());
        return {
          id: `csv-${index}`,
          name: values[nameIndex] || '',
          email: values[emailIndex] || '',
        };
      }).filter(s => s.name && s.email);

      setCsvStudents(students);
      toast.success(`${students.length} students loaded from CSV`);
    };

    reader.onerror = () => {
      toast.error('Error reading CSV file');
    };

    reader.readAsText(file);
  };

  const handleCreateBatch = () => {
    if (uploadMethod === 'csv' && csvStudents.length > 0) {
      toast.success(`Batch created with ${csvStudents.length} students!`);
      setIsOpen(false);
      // Reset state
      setCsvFile(null);
      setCsvStudents([]);
      setUploadMethod('manual');
    } else {
      toast.success('Batch created successfully!');
      setIsOpen(false);
    }
  };

  const removeStudent = (id: string) => {
    setCsvStudents(csvStudents.filter(s => s.id !== id));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button style={{ backgroundColor: 'var(--color-primary)' }}>
          <Plus className="w-4 h-4 mr-2" />
          Create Batch
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Batch</DialogTitle>
          <DialogDescription>
            Add a new batch to the platform
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="batch-name">Batch Name</Label>
            <Input id="batch-name" placeholder="e.g., DSA Batch - Winter 2026" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="course">Course</Label>
            <Select>
              <SelectTrigger id="course">
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map(course => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input id="start-date" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input id="end-date" type="date" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="schedule">Schedule</Label>
            <Input id="schedule" placeholder="e.g., Mon, Wed, Fri - 6:00 PM" />
          </div>

          {/* Student Upload Section */}
          <div className="space-y-3 pt-2 border-t">
            <Label>Add Students</Label>
            <Tabs value={uploadMethod} onValueChange={(v) => setUploadMethod(v as 'manual' | 'csv')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                <TabsTrigger value="csv">CSV Upload</TabsTrigger>
              </TabsList>
              
              <TabsContent value="manual" className="space-y-3">
                <p className="text-sm text-neutral-600">
                  Students can be added manually after batch creation
                </p>
              </TabsContent>
              
              <TabsContent value="csv" className="space-y-3">
                <div className="space-y-2">
                  <p className="text-sm text-neutral-600">
                    Upload a CSV file with student information. Format: name, email
                  </p>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept=".csv"
                      onChange={handleCSVUpload}
                      className="hidden"
                      id="csv-upload"
                    />
                    <Label 
                      htmlFor="csv-upload"
                      className="flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-md cursor-pointer hover:bg-neutral-50 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      {csvFile ? csvFile.name : 'Choose CSV File'}
                    </Label>
                    {csvFile && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCsvFile(null);
                          setCsvStudents([]);
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  {csvStudents.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">
                          Loaded Students ({csvStudents.length})
                        </Label>
                        <Badge style={{ backgroundColor: 'var(--color-accent)' }}>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Ready
                        </Badge>
                      </div>
                      <ScrollArea className="h-48 border rounded-md p-2">
                        <div className="space-y-2">
                          {csvStudents.map((student) => (
                            <div
                              key={student.id}
                              className="flex items-center justify-between p-2 bg-neutral-50 rounded-md text-sm"
                            >
                              <div>
                                <p className="font-medium">{student.name}</p>
                                <p className="text-xs text-neutral-600">{student.email}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeStudent(student.id)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex gap-2 pt-2">
            <Button 
              className="flex-1" 
              style={{ backgroundColor: 'var(--color-primary)' }}
              onClick={handleCreateBatch}
            >
              Create Batch
              {uploadMethod === 'csv' && csvStudents.length > 0 && ` with ${csvStudents.length} Students`}
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
