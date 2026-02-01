export namespace models {
	
	export class ClusterHealth {
	    cluster_name: string;
	    status: string;
	    timed_out: boolean;
	    number_of_nodes: number;
	    number_of_data_nodes: number;
	    active_primary_shards: number;
	    active_shards: number;
	    relocating_shards: number;
	    initializing_shards: number;
	    unassigned_shards: number;
	    delayed_unassigned_shards: number;
	    number_of_pending_tasks: number;
	    number_of_in_flight_fetch: number;
	    task_max_waiting_in_queue_millis: number;
	    active_shards_percent_as_number: number;
	
	    static createFrom(source: any = {}) {
	        return new ClusterHealth(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.cluster_name = source["cluster_name"];
	        this.status = source["status"];
	        this.timed_out = source["timed_out"];
	        this.number_of_nodes = source["number_of_nodes"];
	        this.number_of_data_nodes = source["number_of_data_nodes"];
	        this.active_primary_shards = source["active_primary_shards"];
	        this.active_shards = source["active_shards"];
	        this.relocating_shards = source["relocating_shards"];
	        this.initializing_shards = source["initializing_shards"];
	        this.unassigned_shards = source["unassigned_shards"];
	        this.delayed_unassigned_shards = source["delayed_unassigned_shards"];
	        this.number_of_pending_tasks = source["number_of_pending_tasks"];
	        this.number_of_in_flight_fetch = source["number_of_in_flight_fetch"];
	        this.task_max_waiting_in_queue_millis = source["task_max_waiting_in_queue_millis"];
	        this.active_shards_percent_as_number = source["active_shards_percent_as_number"];
	    }
	}
	export class ClusterInfo {
	    name: string;
	    cluster_name: string;
	    cluster_uuid: string;
	    // Go type: struct { Number string "json:\"number\""; BuildFlavor string "json:\"build_flavor\""; BuildType string "json:\"build_type\""; BuildHash string "json:\"build_hash\""; BuildDate string "json:\"build_date\""; LuceneVersion string "json:\"lucene_version\""; MinimumWireCompatibilityVersion string "json:\"minimum_wire_compatibility_version\""; MinimumIndexCompatibilityVersion string "json:\"minimum_index_compatibility_version\"" }
	    version: any;
	    tagline: string;
	
	    static createFrom(source: any = {}) {
	        return new ClusterInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.cluster_name = source["cluster_name"];
	        this.cluster_uuid = source["cluster_uuid"];
	        this.version = this.convertValues(source["version"], Object);
	        this.tagline = source["tagline"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Collection {
	    id: number;
	    name: string;
	    description?: string;
	    created_at: string;
	    updated_at: string;
	
	    static createFrom(source: any = {}) {
	        return new Collection(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.description = source["description"];
	        this.created_at = source["created_at"];
	        this.updated_at = source["updated_at"];
	    }
	}
	export class CollectionTreeNode {
	    id: number;
	    name: string;
	    type: string;
	    method?: string;
	    url?: string;
	    body?: string;
	    description?: string;
	    children?: CollectionTreeNode[];
	
	    static createFrom(source: any = {}) {
	        return new CollectionTreeNode(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.type = source["type"];
	        this.method = source["method"];
	        this.url = source["url"];
	        this.body = source["body"];
	        this.description = source["description"];
	        this.children = this.convertValues(source["children"], CollectionTreeNode);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Config {
	    id: number;
	    connection_name: string;
	    env_indicator_color: string;
	    host: string;
	    port: string;
	    ssl_or_https: boolean;
	    authentication_method: string;
	    username?: string;
	    password?: string;
	    set_as_default: boolean;
	    created_at: string;
	    updated_at: string;
	
	    static createFrom(source: any = {}) {
	        return new Config(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.connection_name = source["connection_name"];
	        this.env_indicator_color = source["env_indicator_color"];
	        this.host = source["host"];
	        this.port = source["port"];
	        this.ssl_or_https = source["ssl_or_https"];
	        this.authentication_method = source["authentication_method"];
	        this.username = source["username"];
	        this.password = source["password"];
	        this.set_as_default = source["set_as_default"];
	        this.created_at = source["created_at"];
	        this.updated_at = source["updated_at"];
	    }
	}
	export class ConnectionTestRequest {
	    host: string;
	    port: string;
	    ssl_or_https: boolean;
	    authentication_method: string;
	    username?: string;
	    password?: string;
	    api_key?: string;
	
	    static createFrom(source: any = {}) {
	        return new ConnectionTestRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.host = source["host"];
	        this.port = source["port"];
	        this.ssl_or_https = source["ssl_or_https"];
	        this.authentication_method = source["authentication_method"];
	        this.username = source["username"];
	        this.password = source["password"];
	        this.api_key = source["api_key"];
	    }
	}
	export class ConnectionTestResponse {
	    success: boolean;
	    message: string;
	    cluster_name?: string;
	    version?: string;
	    error_details?: string;
	    error_code?: string;
	
	    static createFrom(source: any = {}) {
	        return new ConnectionTestResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.success = source["success"];
	        this.message = source["message"];
	        this.cluster_name = source["cluster_name"];
	        this.version = source["version"];
	        this.error_details = source["error_details"];
	        this.error_code = source["error_code"];
	    }
	}
	export class CreateCollectionRequest {
	    name: string;
	    description?: string;
	
	    static createFrom(source: any = {}) {
	        return new CreateCollectionRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.description = source["description"];
	    }
	}
	export class CreateConfigRequest {
	    connection_name: string;
	    env_indicator_color: string;
	    host: string;
	    port: string;
	    ssl_or_https: boolean;
	    authentication_method: string;
	    username?: string;
	    password?: string;
	    set_as_default: boolean;
	
	    static createFrom(source: any = {}) {
	        return new CreateConfigRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.connection_name = source["connection_name"];
	        this.env_indicator_color = source["env_indicator_color"];
	        this.host = source["host"];
	        this.port = source["port"];
	        this.ssl_or_https = source["ssl_or_https"];
	        this.authentication_method = source["authentication_method"];
	        this.username = source["username"];
	        this.password = source["password"];
	        this.set_as_default = source["set_as_default"];
	    }
	}
	export class CreateFolderRequest {
	    name: string;
	    parent_folder_id?: number;
	    collection_id: number;
	
	    static createFrom(source: any = {}) {
	        return new CreateFolderRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.parent_folder_id = source["parent_folder_id"];
	        this.collection_id = source["collection_id"];
	    }
	}
	export class CreateIndexRequest {
	    config_id: number;
	    index_name: string;
	    num_shards: number;
	    num_replicas: number;
	
	    static createFrom(source: any = {}) {
	        return new CreateIndexRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.config_id = source["config_id"];
	        this.index_name = source["index_name"];
	        this.num_shards = source["num_shards"];
	        this.num_replicas = source["num_replicas"];
	    }
	}
	export class CreateIndexResponse {
	    success: boolean;
	    acknowledged?: boolean;
	    shards_acknowledged?: boolean;
	    index?: string;
	    error?: string;
	
	    static createFrom(source: any = {}) {
	        return new CreateIndexResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.success = source["success"];
	        this.acknowledged = source["acknowledged"];
	        this.shards_acknowledged = source["shards_acknowledged"];
	        this.index = source["index"];
	        this.error = source["error"];
	    }
	}
	export class CreateRequestRequest {
	    name: string;
	    method: string;
	    url: string;
	    body?: string;
	    description?: string;
	    folder_id?: number;
	    collection_id: number;
	
	    static createFrom(source: any = {}) {
	        return new CreateRequestRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.method = source["method"];
	        this.url = source["url"];
	        this.body = source["body"];
	        this.description = source["description"];
	        this.folder_id = source["folder_id"];
	        this.collection_id = source["collection_id"];
	    }
	}
	export class DeleteIndexRequest {
	    config_id: number;
	    index_name: string;
	
	    static createFrom(source: any = {}) {
	        return new DeleteIndexRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.config_id = source["config_id"];
	        this.index_name = source["index_name"];
	    }
	}
	export class DeleteIndexResponse {
	    success: boolean;
	    acknowledged?: boolean;
	    error?: string;
	
	    static createFrom(source: any = {}) {
	        return new DeleteIndexResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.success = source["success"];
	        this.acknowledged = source["acknowledged"];
	        this.error = source["error"];
	    }
	}
	export class ElasticsearchRestRequest {
	    method: string;
	    endpoint: string;
	    body?: string;
	
	    static createFrom(source: any = {}) {
	        return new ElasticsearchRestRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.method = source["method"];
	        this.endpoint = source["endpoint"];
	        this.body = source["body"];
	    }
	}
	export class ElasticsearchRestResponse {
	    success: boolean;
	    status_code: number;
	    response: string;
	    duration?: string;
	    error_details?: string;
	    error_code?: string;
	
	    static createFrom(source: any = {}) {
	        return new ElasticsearchRestResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.success = source["success"];
	        this.status_code = source["status_code"];
	        this.response = source["response"];
	        this.duration = source["duration"];
	        this.error_details = source["error_details"];
	        this.error_code = source["error_code"];
	    }
	}
	export class Folder {
	    id: number;
	    name: string;
	    parent_folder_id?: number;
	    collection_id: number;
	    created_at: string;
	    updated_at: string;
	
	    static createFrom(source: any = {}) {
	        return new Folder(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.parent_folder_id = source["parent_folder_id"];
	        this.collection_id = source["collection_id"];
	        this.created_at = source["created_at"];
	        this.updated_at = source["updated_at"];
	    }
	}
	export class IndexInfo {
	    name: string;
	    health: string;
	    status: string;
	    uuid: string;
	    pri: string;
	    rep: string;
	    docs_count: string;
	    docs_deleted: string;
	    store_size: string;
	    pri_store_size: string;
	    creation_date: string;
	    // Go type: time
	    creation_time: any;
	    segments?: string;
	    aliases?: string;
	
	    static createFrom(source: any = {}) {
	        return new IndexInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.health = source["health"];
	        this.status = source["status"];
	        this.uuid = source["uuid"];
	        this.pri = source["pri"];
	        this.rep = source["rep"];
	        this.docs_count = source["docs_count"];
	        this.docs_deleted = source["docs_deleted"];
	        this.store_size = source["store_size"];
	        this.pri_store_size = source["pri_store_size"];
	        this.creation_date = source["creation_date"];
	        this.creation_time = this.convertValues(source["creation_time"], null);
	        this.segments = source["segments"];
	        this.aliases = source["aliases"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class IndexMetrics {
	    document_count: number;
	    disk_usage: string;
	    disk_usage_bytes: number;
	
	    static createFrom(source: any = {}) {
	        return new IndexMetrics(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.document_count = source["document_count"];
	        this.disk_usage = source["disk_usage"];
	        this.disk_usage_bytes = source["disk_usage_bytes"];
	    }
	}
	export class IndicesResponse {
	    success: boolean;
	    indices?: IndexInfo[];
	    error?: string;
	
	    static createFrom(source: any = {}) {
	        return new IndicesResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.success = source["success"];
	        this.indices = this.convertValues(source["indices"], IndexInfo);
	        this.error = source["error"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class NodeCounts {
	    master: number;
	    data: number;
	    ingest: number;
	    total: number;
	
	    static createFrom(source: any = {}) {
	        return new NodeCounts(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.master = source["master"];
	        this.data = source["data"];
	        this.ingest = source["ingest"];
	        this.total = source["total"];
	    }
	}
	export class NodeInfo {
	    id: string;
	    name: string;
	    ip: string;
	    master: boolean;
	    roles: string[];
	    role_string: string;
	    attributes: string;
	    load: string;
	    cpu_percent: number;
	    ram_percent: number;
	    heap_percent: number;
	    disk_percent: number;
	    shards: number;
	    version: string;
	
	    static createFrom(source: any = {}) {
	        return new NodeInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.ip = source["ip"];
	        this.master = source["master"];
	        this.roles = source["roles"];
	        this.role_string = source["role_string"];
	        this.attributes = source["attributes"];
	        this.load = source["load"];
	        this.cpu_percent = source["cpu_percent"];
	        this.ram_percent = source["ram_percent"];
	        this.heap_percent = source["heap_percent"];
	        this.disk_percent = source["disk_percent"];
	        this.shards = source["shards"];
	        this.version = source["version"];
	    }
	}
	export class NodesResponse {
	    success: boolean;
	    nodes: NodeInfo[];
	    error?: string;
	
	    static createFrom(source: any = {}) {
	        return new NodesResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.success = source["success"];
	        this.nodes = this.convertValues(source["nodes"], NodeInfo);
	        this.error = source["error"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ShardCounts {
	    primary: number;
	    replica: number;
	    total: number;
	
	    static createFrom(source: any = {}) {
	        return new ShardCounts(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.primary = source["primary"];
	        this.replica = source["replica"];
	        this.total = source["total"];
	    }
	}
	export class ProcessedDashboardData {
	    cluster_info?: ClusterInfo;
	    cluster_health?: ClusterHealth;
	    node_counts?: NodeCounts;
	    shard_counts?: ShardCounts;
	    index_metrics?: IndexMetrics;
	
	    static createFrom(source: any = {}) {
	        return new ProcessedDashboardData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.cluster_info = this.convertValues(source["cluster_info"], ClusterInfo);
	        this.cluster_health = this.convertValues(source["cluster_health"], ClusterHealth);
	        this.node_counts = this.convertValues(source["node_counts"], NodeCounts);
	        this.shard_counts = this.convertValues(source["shard_counts"], ShardCounts);
	        this.index_metrics = this.convertValues(source["index_metrics"], IndexMetrics);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Request {
	    id: number;
	    name: string;
	    method: string;
	    url: string;
	    body?: string;
	    description?: string;
	    folder_id?: number;
	    collection_id: number;
	    created_at: string;
	    updated_at: string;
	
	    static createFrom(source: any = {}) {
	        return new Request(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.method = source["method"];
	        this.url = source["url"];
	        this.body = source["body"];
	        this.description = source["description"];
	        this.folder_id = source["folder_id"];
	        this.collection_id = source["collection_id"];
	        this.created_at = source["created_at"];
	        this.updated_at = source["updated_at"];
	    }
	}
	
	export class UpdateCollectionRequest {
	    name?: string;
	    description?: string;
	
	    static createFrom(source: any = {}) {
	        return new UpdateCollectionRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.description = source["description"];
	    }
	}
	export class UpdateConfigRequest {
	    connection_name?: string;
	    env_indicator_color?: string;
	    host?: string;
	    port?: string;
	    ssl_or_https?: boolean;
	    authentication_method?: string;
	    username?: string;
	    password?: string;
	    set_as_default?: boolean;
	
	    static createFrom(source: any = {}) {
	        return new UpdateConfigRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.connection_name = source["connection_name"];
	        this.env_indicator_color = source["env_indicator_color"];
	        this.host = source["host"];
	        this.port = source["port"];
	        this.ssl_or_https = source["ssl_or_https"];
	        this.authentication_method = source["authentication_method"];
	        this.username = source["username"];
	        this.password = source["password"];
	        this.set_as_default = source["set_as_default"];
	    }
	}
	export class UpdateFolderRequest {
	    name?: string;
	    parent_folder_id?: number;
	
	    static createFrom(source: any = {}) {
	        return new UpdateFolderRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.parent_folder_id = source["parent_folder_id"];
	    }
	}
	export class UpdateRequestRequest {
	    name?: string;
	    method?: string;
	    url?: string;
	    body?: string;
	    description?: string;
	    folder_id?: number;
	    collection_id?: number;
	
	    static createFrom(source: any = {}) {
	        return new UpdateRequestRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.method = source["method"];
	        this.url = source["url"];
	        this.body = source["body"];
	        this.description = source["description"];
	        this.folder_id = source["folder_id"];
	        this.collection_id = source["collection_id"];
	    }
	}

}

