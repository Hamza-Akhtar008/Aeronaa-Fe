import { Check, MapPin, Plane, Shield, Smartphone, CreditCard } from "lucide-react"

interface ProgressIndicatorProps {
  currentStep: number
}

const steps = [
  { number: 1, title: "Traveler details", icon: <MapPin className="h-4 w-4" /> },
  
 
  { number: 2, title: "Review itinerary", icon: <Check className="h-4 w-4" /> },
]

export default function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= step.number ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              {currentStep > step.number ? (
                <Check className="h-4 w-4" />
              ) : (
                <span className="text-sm font-medium">{step.number}</span>
              )}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-0.5 mx-2 ${currentStep > step.number ? "bg-blue-600" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2">
        {steps.map((step) => (
          <div key={step.number} className="text-xs text-gray-600 text-center w-20">
            {step.title}
          </div>
        ))}
      </div>
    </div>
  )
}
