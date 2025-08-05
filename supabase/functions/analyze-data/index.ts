import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the current user
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { projectId, analysisType = 'root_cause' } = await req.json()

    if (!projectId) {
      return new Response(
        JSON.stringify({ error: 'Project ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get the project data
    const { data: project, error: projectError } = await supabaseClient
      .from('analysis_projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    if (projectError || !project) {
      return new Response(
        JSON.stringify({ error: 'Project not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Simulate data analysis process
    const analysisResults = {
      analysisType,
      timestamp: new Date().toISOString(),
      summary: {
        totalDataPoints: Math.floor(Math.random() * 1000) + 100,
        identifiedIssues: Math.floor(Math.random() * 10) + 1,
        confidenceScore: Math.round((Math.random() * 0.3 + 0.7) * 100) / 100,
      },
      rootCauses: [
        {
          id: '1',
          description: 'Equipment vibration exceeding normal parameters',
          probability: 0.85,
          impact: 'High',
          category: 'Mechanical'
        },
        {
          id: '2', 
          description: 'Temperature fluctuations in Process Unit A',
          probability: 0.72,
          impact: 'Medium',
          category: 'Process'
        },
        {
          id: '3',
          description: 'Inconsistent raw material quality',
          probability: 0.68,
          impact: 'Medium',
          category: 'Material'
        }
      ],
      recommendations: [
        'Schedule immediate equipment inspection and calibration',
        'Implement enhanced temperature monitoring system',
        'Review supplier quality standards and contracts'
      ],
      chartData: {
        timeSeriesData: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: Math.random() * 100 + 50,
          anomaly: Math.random() > 0.8
        })),
        categoryData: [
          { category: 'Mechanical', count: 3, severity: 'High' },
          { category: 'Process', count: 2, severity: 'Medium' },
          { category: 'Material', count: 1, severity: 'Low' },
          { category: 'Environmental', count: 1, severity: 'Low' }
        ]
      }
    }

    // Update the project with analysis results
    const { error: updateError } = await supabaseClient
      .from('analysis_projects')
      .update({ 
        analysis_results: analysisResults,
        status: 'completed'
      })
      .eq('id', projectId)

    if (updateError) {
      console.error('Error updating project:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to save analysis results' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysisResults,
        message: 'Analysis completed successfully' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in analyze-data function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})