import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function DesignDemoPage() {
    return (
        <div className="min-h-screen p-8 space-y-8 flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Design System Demo
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                {/* Buttons Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Buttons</CardTitle>
                        <CardDescription>Various button styles and states.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-4">
                        <Button variant="default">Default</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="destructive">Destructive</Button>
                        <Button variant="glass">Glass</Button>
                    </CardContent>
                </Card>

                {/* Inputs Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Inputs</CardTitle>
                        <CardDescription>Input fields with glassmorphism.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input placeholder="Default Input" />
                        <Input placeholder="Disabled Input" disabled />
                    </CardContent>
                </Card>

                {/* Glassmorphism Card Demo */}
                <Card className="md:col-span-2 border-primary/20">
                    <CardHeader>
                        <CardTitle>Glassmorphism Card</CardTitle>
                        <CardDescription>This card demonstrates the glass effect on a vibrant background.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="leading-7">
                            The design system uses a vibrant HSL color palette with a glassmorphism effect.
                            The background is a subtle gradient that shifts between light and dark modes.
                            Components are designed to be clean, modern, and accessible.
                        </p>
                    </CardContent>
                    <CardFooter className="justify-end">
                        <Button variant="default">Action</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
