import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { PackageFormData } from "../package-form"

interface ReligiousServicesSectionProps {
  formData: PackageFormData
  updateFormData: (updates: Partial<PackageFormData>) => void
  errors?: Record<string, string>
  onFieldChange?: (fieldName: string) => void
}

export function ReligiousServicesSection({
  formData,
  updateFormData,
  errors = {},
  onFieldChange,
}: ReligiousServicesSectionProps) {
  const handleInputChange = (field: string, value: any) => {
    updateFormData({ [field]: value })
    onFieldChange?.(field)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Religious Services</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Select the religious services and guidance included in your package
        </p>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="guidedTour" className="text-base font-medium">
                Guided Tour / Scholar
              </Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Professional religious guide or scholar to accompany the group
              </p>
            </div>
            <Switch
              id="guidedTour"
              checked={formData.guidedTour}
              onCheckedChange={(checked) => handleInputChange("guidedTour", checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="umrahVisa" className="text-base font-medium">
                Umrah Visa Processing
              </Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Complete visa processing and documentation assistance
              </p>
            </div>
            <Switch
              id="umrahVisa"
              checked={formData.umrahVisa}
              onCheckedChange={(checked) => handleInputChange("umrahVisa", checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="ritualAssistance" className="text-base font-medium">
                Assistance in Rituals
              </Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Step-by-step guidance for performing Umrah rituals correctly
              </p>
            </div>
            <Switch
              id="ritualAssistance"
              checked={formData.ritualAssistance}
              onCheckedChange={(checked) => handleInputChange("ritualAssistance", checked)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
