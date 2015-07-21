'use strict';

var serverQueries = {

    heapUsedPerc: {
        metadata: {
            type: "time",
            title: "Heap Memory Usage",
            yaxis: "Percentage"
        },
        "query": {
            "filtered": {
                "filter": {
                    "bool": {
                        "must": [
                            {
                                "range": {
                                    "@timestamp": {
                                        gte: "${params.from}",
                                        lte: "${params.to}"
                                    }
                                }
                            }
                        ]

                    }
                }
            }
        },
        "aggs": {
            "timechart": {
                "date_histogram": {
                    "field": "@timestamp",
                    "interval": "${params.interval}ms",
                    "min_doc_count": 1
                },
                "aggs": {
                    "heapUsedPerc": {
                        "max": {
                            "field": "heapUsedPerc"
                        }

                    }
                }
            }
        }
    },

    indiceSize: {
        metadata: {
            type: "time",
            title: "Indice Size",
            yaxis: "Size",
            yaxisFormat: "filesize(bits)"
        },
        "query": {
            "filtered": {
                "filter": {
                    "bool": {
                        "must": [
                            {
                                "range": {
                                    "@timestamp": {
                                        gte: "${params.from}",
                                        lte: "${params.to}"
                                    }
                                }
                            }
                        ]

                    }
                }
            }
        },
        "aggs": {
            "timechart": {
                "date_histogram": {
                    "field": "@timestamp",
                    "interval": "${params.interval}ms",
                    "min_doc_count": 1
                },
                "aggs": {
                    "indiceSize": {
                        "avg": {
                            "field": "indiceSize"
                        }

                    }
                }
            }
        }
    },

    os_and_process_cpu_usage: {
        metadata: {
            type: "time",
            title: "OS and Process CPU Usage",
            yaxis: "Percentage"
        },
        "query": {
            "filtered": {
                "filter": {
                    "bool": {
                        "must": [
                            {
                                "range": {
                                    "@timestamp": {
                                        gte: "${params.from}",
                                        lte: "${params.to}"
                                    }
                                }
                            }
                        ]

                    }
                }
            }
        },
        "aggs": {
            "timechart": {
                "date_histogram": {
                    "field": "@timestamp",
                    "interval": "${params.interval}ms",
                    "min_doc_count": 1
                },
                "aggs": {
                    "OS CPU Usage": {
                        "max": {
                            "field": "osCpu"
                        }

                    },
                    "Process CPU Usage": {
                        "max": {
                            "field": "processCpu"
                        }

                    }
                }
            }
        }
    },

    osLoadAverage_1m_5m_15m: {
        metadata: {
            type: "time",
            title: "OS Load Average",
            yaxis: "Processes"
        },
        "query": {
            "filtered": {
                "filter": {
                    "bool": {
                        "must": [
                            {
                                "range": {
                                    "@timestamp": {
                                        gte: "${params.from}",
                                        lte: "${params.to}"
                                    }
                                }
                            }
                        ]

                    }
                }
            }
        },
        "aggs": {
            "timechart": {
                "date_histogram": {
                    "field": "@timestamp",
                    "interval": "${params.interval}ms",
                    "min_doc_count": 1
                },
                "aggs": {
                    "OS Load Average 1m": {
                        "avg": {
                            "field": "osLoadAverage_1m"
                        }

                    },
                    "OS Load Average 5m": {
                        "avg": {
                            "field": "osLoadAverage_5m"
                        }

                    },
                    "OS Load Average 15m": {
                        "avg": {
                            "field": "osLoadAverage_15m"
                        }

                    }
                }
            }
        }
    },

    osMem: {
        metadata: {
            type: "time",
            title: "OS Memory Usage",
            yaxis: "Size"
        },
        "query": {
            "filtered": {
                "filter": {
                    "bool": {
                        "must": [
                            {
                                "range": {
                                    "@timestamp": {
                                        gte: "${params.from}",
                                        lte: "${params.to}"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        },
        "aggs": {
            "timechart": {
                "date_histogram": {
                    "field": "@timestamp",
                    "interval": "${params.interval}ms",
                    "min_doc_count": 1
                },
                "aggs": {
                    "osMem": {
                        "avg": {
                            "field": "osMem"
                        }

                    }
                }
            }
        }
    },

    processMemAll: {
        metadata: {
            type: "time",
            title: "Process Memory Usage",
            yaxis: "Size",
            yaxisFormat: "filesize(bits)"
        },
        "query": {
            "filtered": {
                "filter": {
                    "bool": {
                        "must": [
                            {
                                "range": {
                                    "@timestamp": {
                                        gte: "${params.from}",
                                        lte: "${params.to}"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        },
        "aggs": {
            "timechart": {
                "date_histogram": {
                    "field": "@timestamp",
                    "interval": "${params.interval}ms",
                    "min_doc_count": 1
                },
                "aggs": {
                    "Process Memory - Resident": {
                        "avg": {
                            "field": "processMem_resident"
                        }

                    },
                    "Process Memory - Share": {
                        "avg": {
                            "field": "processMem_share"
                        }

                    },
                    "Process Memory - Virtual": {
                        "avg": {
                            "field": "processMem_total_virtual"
                        }
                    }
                }
            }
        }
    },

    gcTime: {
        metadata: {
            type: "time",
            title: "Garbage Collector",
            yaxis: "Time",
            yaxisFormat: "filesize(bits)"
        },
        "query": {
            "filtered": {
                "filter": {
                    "bool": {
                        "must": [
                            {
                                "range": {
                                    "@timestamp": {
                                        gte: "${params.from}",
                                        lte: "${params.to}"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        },
        "aggs": {
            "timechart": {
                "date_histogram": {
                    "field": "@timestamp",
                    "interval": "${params.interval}ms",
                    "min_doc_count": 1
                },
                "aggs": {
                    "GC Time": {
                        "max": {
                            "field": "gcTime"
                        }
                    }
                }
            }
        }
    },
    nodeInfo: {
        "query": {
            "filtered": {
                "filter": {
                    "bool": {
                        "must": [
                            {
                                "exists" : { "field" : "fs_free_perc" }
                            },
                            {
                                "range": {
                                    "@timestamp": {
                                        gte: "${params.from}",
                                        lte: "${params.to}"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        },
        "aggs": {
            "Node Name": {
                "terms": {
                    "field": "niceName",
                    "size": 5,
                    "order": {
                        "Heap Used Percentage": "desc"
                    }
                },
                "aggs": {
                    "Heap Used Percentage": {
                        "avg": {
                            "field": "heapUsedPerc"
                        }
                    },
                    "Free Disk Space Percentage": {
                        "avg": {
                            "field": "fs_free_perc"
                        }
                    }
                }
            }
        }
    }
};

module.exports = serverQueries;