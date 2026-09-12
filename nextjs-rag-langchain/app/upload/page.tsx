"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { processPdfFile } from "./action";

export default function UploadPdf() {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{
        type: "error" | "success";
        text: string;
    } | null>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("pdf", file);

            const result = await processPdfFile(formData);

            if (result.success) {
                setMessage({
                    type: "success",
                    text: result.message || "PDF processed succesfully",
                });
            } else {
                setMessage({
                    type: "error",
                    text: result.error || "Failed to process the PDF",
                });
            }
        } catch (error) {
            setMessage({
                type: "error",
                text: "An error occured while processing the pdf",
            });
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto ">
                <h1>PDF upload</h1>

                <Card>
                    <CardContent>
                        <div>
                            <Label htmlFor="pdf-upload">Upload PDF file</Label>
                            <Input
                                id="pdf"
                                type="file"
                                accept=".pdf"
                                onClick={handleFileUpload}
                                disabled={isLoading}
                            />
                        </div>
                        {isLoading && (
                            <div className="flex justify-center items-center gap-2">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span>Processing pdf....</span>
                            </div>
                        )}

                        {message && (
                            <Alert
                                variant={
                                    message.type === "error"
                                        ? "destructive"
                                        : "default"
                                }
                            >
                                <AlertTitle>
                                    {message.type === "error"
                                        ? "Error!"
                                        : "Success"}
                                </AlertTitle>
                                <AlertDescription>
                                    {message.text}
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
