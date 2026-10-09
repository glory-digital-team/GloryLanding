{{- define "landing.name" -}}glory-landing{{- end -}}
{{- define "landing.labels" -}}
app: {{ include "landing.name" . }}
app.kubernetes.io/name: {{ include "landing.name" . }}
app.kubernetes.io/version: {{ .Values.image.tag | default .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}
