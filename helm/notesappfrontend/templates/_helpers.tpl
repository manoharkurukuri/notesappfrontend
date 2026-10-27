{{- define "notesappfrontend.name" -}}
{{- .Chart.Name | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "notesappfrontend.fullname" -}}
{{- printf "%s" .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "notesappfrontend.labels" -}}
app.kubernetes.io/name: {{ include "notesappfrontend.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
helm.sh/chart: {{ printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" }}
{{- end -}}

{{- define "notesappfrontend.selectorLabels" -}}
app.kubernetes.io/name: {{ include "notesappfrontend.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}