import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.1'

Deno.serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Update all tasks to trigger recalculation
    const { data, error } = await supabaseClient
      .from('tarefas')
      .update({ updated_at: new Date().toISOString() })
      .neq('id', '00000000-0000-0000-0000-000000000000') // Update all records
      .select('id, titulo, linha, coluna')

    if (error) throw error

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Tasks recalculated successfully',
        count: data?.length || 0,
        tasks: data
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
