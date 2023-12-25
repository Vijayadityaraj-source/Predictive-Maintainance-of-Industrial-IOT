#include "contiki.h"
#include "dev/leds.h"
#include "dev/sht11/sht11-sensor.h"
#include "jsontree.h"
#include "json-ws.h"
#include <stdio.h>

#define DEBUG 0
#if DEBUG
#define PRINTF(...) printf(__VA_ARGS__)
#else
#define PRINTF(...)
#endif

PROCESS(websense_process, "Websense (sky)");
AUTOSTART_PROCESSES(&websense_process);

/*---------------------------------------------------------------------------*/
static CC_INLINE int
get_kg(void)
{
  static int c = 0;  
  int max_cycle = 11;
  c = (c + 9) % max_cycle;
  return c;
}



static CC_INLINE int
get_watt(void)
{
  static int c = 0;  
  int max_cycle = 3;
  c = (c + 2) % max_cycle;
  return c;
  
}

static CC_INLINE int
get_p(void)
{
  static int c = 0;  
  int max_cycle = 5;
  c = (c + 11) % max_cycle;
  return c;
  
}

static CC_INLINE int
get_vol(void)
{
  static int c = 0;  
  int max_cycle = 11;
  c = (c + 2) % max_cycle;
  return c;
  
}


/*---------------------------------------------------------------------------*/
static int
output_kg(struct jsontree_context *path)
{
  char buf[5];
  snprintf(buf, sizeof(buf), "%3d", get_kg());
  jsontree_write_atom(path, buf);
  return 0;
}

static int
output_watt(struct jsontree_context *path)
{
  char buf[5];
  snprintf(buf, sizeof(buf), "%3d", get_watt());
  jsontree_write_atom(path, buf);
  return 0;
}

static int
output_p(struct jsontree_context *path)
{
  char buf[5];
  snprintf(buf, sizeof(buf), "%3d", get_p());
  jsontree_write_atom(path, buf);
  return 0;
}

static int
output_vol(struct jsontree_context *path)
{
  char buf[5];
  snprintf(buf, sizeof(buf), "%3d", get_vol());
  jsontree_write_atom(path, buf);
  return 0;
}

static struct jsontree_callback kg_sensor_callback =
  JSONTREE_CALLBACK(output_kg, NULL);
  
static struct jsontree_callback watt_sensor_callback =
  JSONTREE_CALLBACK(output_watt, NULL);
 
static struct jsontree_callback p_sensor_callback =
  JSONTREE_CALLBACK(output_p, NULL);

static struct jsontree_callback vol_sensor_callback =
  JSONTREE_CALLBACK(output_vol, NULL);
 
/*---------------------------------------------------------------------------*/

static struct jsontree_string desc = JSONTREE_STRING("Tmote Sky");
static struct jsontree_string kg_unit = JSONTREE_STRING("kg");
static struct jsontree_string watt_unit = JSONTREE_STRING("Watt");
static struct jsontree_string p_unit = JSONTREE_STRING("Bar");
static struct jsontree_string vol_unit = JSONTREE_STRING("cube m");

JSONTREE_OBJECT(node_tree,
                JSONTREE_PAIR("node-type", &desc),
                JSONTREE_PAIR("time", &json_time_callback));

JSONTREE_OBJECT(kg_sensor_tree,
                JSONTREE_PAIR("unit", &kg_unit),
                JSONTREE_PAIR("value", &kg_sensor_callback));
                
JSONTREE_OBJECT(watt_sensor_tree,
                JSONTREE_PAIR("unit", &watt_unit),
                JSONTREE_PAIR("value", &watt_sensor_callback)); 

JSONTREE_OBJECT(p_sensor_tree,
                JSONTREE_PAIR("unit", &p_unit),
                JSONTREE_PAIR("value", &p_sensor_callback)); 

JSONTREE_OBJECT(vol_sensor_tree,
                JSONTREE_PAIR("unit", &vol_unit),
                JSONTREE_PAIR("value", &vol_sensor_callback));     

JSONTREE_OBJECT(rsc_tree,
                JSONTREE_PAIR("weight", &kg_sensor_tree),
                JSONTREE_PAIR("power", &watt_sensor_tree),
                JSONTREE_PAIR("pressure", &p_sensor_tree),
                JSONTREE_PAIR("volume", &vol_sensor_tree),
                JSONTREE_PAIR("leds", &json_leds_callback));

/* complete node tree */
JSONTREE_OBJECT(tree,
                JSONTREE_PAIR("node", &node_tree),
                JSONTREE_PAIR("rsc", &rsc_tree),
                JSONTREE_PAIR("cfg", &json_subscribe_callback));

/*---------------------------------------------------------------------------*/
/* for cosm plugin */
#if WITH_COSM
/* set COSM value callback to be the temp sensor */
struct jsontree_callback cosm_value_callback =
  JSONTREE_CALLBACK(output_kg, output_watt,output_p, output_vol, NULL);
#endif

PROCESS_THREAD(websense_process, ev, data)
{
  static struct etimer timer;

  PROCESS_BEGIN();

  json_ws_init(&tree);

  SENSORS_ACTIVATE(sht11_sensor);

  json_ws_set_callback("rsc");

  while(1) {
    /* Alive indication with the LED */
    etimer_set(&timer, CLOCK_SECOND * 2);
    PROCESS_WAIT_EVENT_UNTIL(etimer_expired(&timer));
    leds_on(LEDS_RED);
    /*etimer_set(&timer, CLOCK_SECOND / 8);
    PROCESS_WAIT_EVENT_UNTIL(etimer_expired(&timer));
    leds_off(LEDS_RED);
    */
  }

  PROCESS_END();
}
